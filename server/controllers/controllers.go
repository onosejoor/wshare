package controllers

import (
	"archive/zip"
	"io"
	"log"
	supabase "main/db"
	"net/http"
	"strings"

	"time"

	"github.com/Backblaze/blazer/b2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Url struct {
	Key      string `json:"key"`
	FileName string `json:"fileName"`
}

func HandleGet(ctx *gin.Context) {
	var datas []Url
	db := supabase.GetClient()

	_, err := db.From("urls").Select("*", "", false).ExecuteTo(&datas)
	if err != nil {
		log.Println("error getting urls: ", err)
		ctx.JSON(500, gin.H{
			"success": false,
			"message": err,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "File uploaded successfully",
		"urls":    datas,
	})
}

func HandleGetByKey(ctx *gin.Context, bucket *b2.Bucket) {
	key, exists := ctx.Params.Get("key")
	if !exists {
		ctx.JSON(400, gin.H{
			"success": false, "message": "No key param found",
		})
		return

	}
	db := supabase.GetClient()
	var data Url

	_, err := db.From("urls").Select("*", "", false).Single().Eq("key", key).ExecuteTo(&data)
	if err != nil {
		log.Println("error querying db: ", err)
		if strings.Contains(err.Error(), "(or no) rows returned") {
			ctx.JSON(404, gin.H{
				"success": false, "message": "No data found with key: " + key,
			})
			return
		}
		ctx.JSON(500, gin.H{
			"success": false, "message": err.Error(),
		})
		return
	}

	obj := bucket.Object(data.FileName)

	url, _ := obj.AuthURL(ctx, time.Hour, "")

	// ctx.Redirect(http.StatusPermanentRedirect, url.String())
	ctx.JSON(200, gin.H{
		"success": true, "message": "successfull", "url": url.String(), "fileName": data.FileName,
	})

}

func HandlePost(ctx *gin.Context, bucket *b2.Bucket) {
	startTotal := time.Now()
	formData, err := ctx.MultipartForm()
	if err != nil {
		ctx.AbortWithStatusJSON(400, gin.H{
			"message": "No file is received",
		})
		return
	}

	files, exists := formData.File["file"]
	if !exists {
		ctx.AbortWithStatusJSON(400, gin.H{
			"message": "formdata name must be of key 'file'",
		})
		return
	}

	const MaxTotalSize = 100 * 1024 * 1024 // 100MB
	totalSize := int64(0)
	for _, file := range files {
		totalSize += file.Size
		if totalSize > MaxTotalSize {
			ctx.AbortWithStatusJSON(400, gin.H{
				"message": "Total file size exceeds the 100MB limit.",
			})
			return
		}
	}

	db := supabase.GetClient()
	randId := uuid.New().String()
	var objectName string
	var cleanupFunc func()

	defer func() {
		if cleanupFunc != nil {
			cleanupFunc()
		}
	}()

	if len(files) < 2 {
		file := files[0]
		objectName = file.Filename
		fileReader, err := file.Open()
		if err != nil {
			ctx.JSON(500, gin.H{"success": false, "message": "Failed to open file"})
			return
		}
		defer fileReader.Close()

		obj := bucket.Object(objectName)
		writer := obj.NewWriter(ctx)
		writer.ConcurrentUploads = 10

		cleanupFunc = func() {
			writer.Close()
			bucket.Object(objectName).Delete(ctx)
		}

		log.Printf("Start uploading %s", file.Filename)
		startUpload := time.Now()

		written, err := io.Copy(writer, fileReader)
		if err != nil {
			log.Printf("Failed to upload file: %v", err)
			ctx.JSON(500, gin.H{"success": false, "message": "Failed to upload"})
			return
		}

		log.Printf("Copied %d bytes in %v", written, time.Since(startUpload))

		startClose := time.Now()
		if err := writer.Close(); err != nil {
			log.Printf("Failed to finalize upload: %v", err)
			ctx.JSON(500, gin.H{"success": false, "message": "Failed to finalize upload"})
			return
		}
		log.Printf("Finalized upload in %v", time.Since(startClose))

	} else {
		objectName = "archive_" + time.Now().Format("20060102-150405") + ".zip"
		obj := bucket.Object(objectName)
		b2Writer := obj.NewWriter(ctx)
		b2Writer.ConcurrentUploads = 16

		cleanupFunc = func() {
			b2Writer.Close()
			obj.Delete(ctx)
		}

		startZip := time.Now()
		zipWriter := zip.NewWriter(b2Writer)

		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				log.Printf("Failed to open file %s: %v", fileHeader.Filename, err)
				continue
			}

			fw, err := zipWriter.Create(fileHeader.Filename)
			if err != nil {
				log.Printf("Failed to create zip entry: %v", err)
				file.Close()
				continue
			}

			_, err = io.Copy(fw, file)
			if err != nil {
				log.Printf("Failed to write to zip: %v", err)
			}
			file.Close()
		}

		log.Printf("Zipped files in %v", time.Since(startZip))

		startClose := time.Now()
		if err := zipWriter.Close(); err != nil {
			log.Printf("Failed to close zipWriter: %v", err)
			ctx.JSON(500, gin.H{"message": "Failed to finalize zip"})
			return
		}

		if err := b2Writer.Close(); err != nil {
			log.Printf("Failed to finalize B2 upload: %v", err)
			ctx.JSON(500, gin.H{"message": "Failed to finalize upload"})
			return
		}
		log.Printf("Finalized zip upload in %v", time.Since(startClose))
	}

	newData := Url{FileName: objectName, Key: randId}
	if _, _, err = db.From("urls").Insert(newData, false, "", "", "").Execute(); err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "Error inserting into DB: " + err.Error(),
		})
		return
	}

	cleanupFunc = nil

	log.Printf("Finished total upload in %v", time.Since(startTotal))
	ctx.JSON(http.StatusOK, gin.H{
		"success":  true,
		"message":  "Files uploaded successfully",
		"key":      randId,
		"fileName": objectName,
	})
}
