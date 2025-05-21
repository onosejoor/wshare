package main

import (
	"main/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.Default())

	router.GET("/file", controllers.HandleGet)

	router.POST("/file", controllers.HandlePost)

	router.Run("localhost:8080")
}
