package controllers

import (
	"context"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Backblaze/blazer/b2"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func HandlePost(ctx *gin.Context) {
	formData, err := ctx.MultipartForm()
	var wg sync.WaitGroup

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

	for _, file := range files {
		file := file
		wg.Add(1)
		go func() {
			defer wg.Done()

			fileContent, err := file.Open()
			if err != nil {
				log.Printf("Failed to open file %s: %v", file.Filename, err)
				return
			}
			defer fileContent.Close()

			obj := bucket.Object(file.Filename)
			writer := obj.NewWriter(context.Background())

			if _, err := io.Copy(writer, fileContent); err != nil {

				log.Printf("Failed to write file %s: %v", file.Filename, err)
				ctx.JSON(500, gin.H{
					"success": false,
					"message": "Failed to write file",
				})
				return
			}

			if err := writer.Close(); err != nil {
				log.Printf("Failed to close writer for %s: %v", file.Filename, err)
				return
			}

			urls, err := bucket.AuthToken(ctx, file.Filename, time.Hour)
			if err != nil {
				log.Printf("error fenerating digned url %s: %v", file.Filename, err)
				return
			}

			log.Printf("Uploaded %s successfully, url: %s", file.Filename, urls)
		}()
	}
	wg.Wait()

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "All files uploaded successfully",
	})
}

func HandleGet(ctx *gin.Context) {
	client, err := connectToB2()
	if err != nil {
		log.Println("Error connecting to b2:", err)

		ctx.AbortWithStatusJSON(500, gin.H{
			"success": false, "message": "Internal error",
		})
		return

	}

	buckets, err := client.ListBuckets(ctx)
	if err != nil {
		log.Println("Error listing buckets:", err)
		return

	}

	for _, bucket := range buckets {
		log.Println(bucket, bucket.Name(), bucket.BaseURL())
	}

	ctx.JSON(200, gin.H{
		"success": true, "message": "B2 connected successfully",
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
