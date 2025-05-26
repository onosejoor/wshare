package main

import (
	"context"
	"log"
	"main/controllers"
	"os"
	"time"

	"github.com/Backblaze/blazer/b2"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalln("error loading .env", err)
	}

	client, err := connectToB2()
	if err != nil {
		log.Fatalln(err)
	}
	bucket, _ := client.Bucket(context.Background(), "wshare")

	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://wshare-ten.vercel.app"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Added common headers you might need
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/cron-jobs", func(ctx *gin.Context) { controllers.HandleCronJob(ctx) })
	router.GET("/supa-cron", func(ctx *gin.Context) { controllers.HandleSupabaseCronJob(ctx) })

	router.GET("/file", controllers.HandleGet)
	router.GET("/file/:key", func(ctx *gin.Context) {
		controllers.HandleGetByKey(ctx, bucket)
	})

	router.POST("/file", func(ctx *gin.Context) {
		controllers.HandlePost(ctx, bucket)
	})

	router.Run(":8080")
}

func connectToB2() (client *b2.Client, err error) {

	ctx := context.Background()

	B2_APPKEY := os.Getenv("B2_APPKEY")
	B2_KEYID := os.Getenv("B2_KEYID")

	client, err = b2.NewClient(ctx, B2_KEYID, B2_APPKEY)
	if err != nil {
		log.Println(err)
		return nil, err

	}

	return client, nil
}
