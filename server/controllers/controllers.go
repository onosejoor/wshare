package controllers

import (
	"archive/zip"
	"context"
	"io"
	"log"
	"net/http"

	"time"

	"github.com/Backblaze/blazer/b2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

var urls = make(map[string]string)

func HandleGet(ctx *gin.Context) {
	randId := uuid.New().String()

	urls[randId] = "sjskjsvvksjajhvjhkajhvjhs"

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "File uploaded successfully",
		"url":     randId,
	})
}

func HandleGetById(ctx *gin.Context) {
	id, exists := ctx.Params.Get("id")
	if !exists {
		ctx.JSON(400, gin.H{
			"success": false, "message": "No id param found",
		})
	}

	url, ok := urls[id]
	if !ok {
		ctx.JSON(404, gin.H{
			"success": false, "message": "Url not found",
		})
	}

	ctx.Redirect(http.StatusPermanentRedirect, url)

}

func HandlePost(ctx *gin.Context) {
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

	if len(files) < 1 {
		ctx.AbortWithStatusJSON(400, gin.H{
			"message": "No files to upload",
		})
		return
	}

	client, err := connectToB2()
	if err != nil {
		log.Println("Error connecting to b2:", err)
		ctx.AbortWithStatusJSON(500, gin.H{
			"success": false, "message": "Internal error",
		})
		return
	}

	bucket, err := client.Bucket(ctx, "wshare")
	if err != nil {
		ctx.JSON(500, gin.H{"success": false, "message": "Failed to access bucket"})
		return
	}

	if len(files) < 2 {
		file := files[0]
		obj := bucket.Object(file.Filename)
		writer := obj.NewWriter(ctx)
		defer writer.Close()

		openedFile, err := file.Open()
		if err != nil {

			log.Printf("Failed to open file %s: %v \n", file.Filename, err)
			ctx.JSON(500, gin.H{"success": false, "message": "Failed to open file"})
			return
		}

		if _, err := io.Copy(writer, openedFile); err != nil {
			log.Printf("Failed to upload file %s: %v \n", file.Filename, err)
			ctx.JSON(500, gin.H{"success": false, "message": "Failed to upload file, try again"})
			return
		}

		randId := uuid.New().String()

		urls[randId] = file.Filename

		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "File uploaded successfully",
			"key":     randId,
		})
		return
	}

	objectName := "archive_" + time.Now().Format("20060102-150405") + ".zip"
	obj := bucket.Object(objectName)
	b2Writer := obj.NewWriter(ctx)
	defer b2Writer.Close()

	zipWriter := zip.NewWriter(b2Writer)

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			log.Printf("Failed to open file %s: %v \n", fileHeader.Filename, err)
			continue
		}
		defer file.Close()

		fw, err := zipWriter.Create(fileHeader.Filename)
		if err != nil {
			log.Printf("Failed to create zip entry for %s: %v", fileHeader.Filename, err)
			file.Close()
			continue
		}

		if _, err := io.Copy(fw, file); err != nil {
			log.Printf("Failed to write file %s: %v \n", fileHeader.Filename, err)
		}
	}

	if err := zipWriter.Close(); err != nil {
		log.Printf("Failed to close zipWriter: %v \n", err)
		ctx.JSON(500, gin.H{"message": "Failed to finalize zip"})
		return
	}

	// url, _ := obj.AuthURL(ctx, time.Hour, "")
	randId := uuid.New().String()

	urls[randId] = objectName

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Files uploaded and zipped successfully",
		"key":     randId,
	})
}

func connectToB2() (client *b2.Client, err error) {
	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Println("error loading .env", err)
		return nil, err
	}
	ctx := context.Background()

	B2_APPKEY := envs["B2_APPKEY"]
	B2_KEYID := envs["B2_KEYID"]

	client, err = b2.NewClient(ctx, B2_KEYID, B2_APPKEY)
	if err != nil {
		log.Println(err)
		return nil, err

	}

	return client, nil
}
