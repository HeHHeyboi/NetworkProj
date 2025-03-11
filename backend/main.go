package main

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/google/uuid"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/auth"
	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"

	// _ "github.com/mattn/go-sqlite3"
	_ "modernc.org/sqlite"
)

type Config struct {
	db             *database.Queries
	secret         string
	admin_email    string
	admin_password string
}

//go:embed sql/schema/*.sql
var embedMigration embed.FS

var duration time.Duration = 24 * time.Hour

const uploadDir = "upload/"

/*
	 TODO:
		3. When create bill and user select /giveAway decreate giveAway.remain by 1 and when it reach zero delete it
*/
func main() {
	godotenv.Load()
	dbName := "main.db"

	db, err := sql.Open("sqlite", dbName)
	defer db.Close()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	if len(os.Args) < 2 {
		gin.SetMode(gin.ReleaseMode)
	} else if os.Args[1] == "test" {
		duration = 10 * time.Second
		gin.SetMode(gin.DebugMode)
	} else if os.Args[1] == "reset" {
		goose.SetBaseFS(embedMigration)
		if err := goose.SetDialect("sqlite"); err != nil {
			panic(err)
		}

		err = goose.Reset(db, "sql/schema")
		if err != nil {
			panic(err)
		}

		fmt.Println("Reset Success")
		err := os.RemoveAll(uploadDir)
		if err != nil {
			panic(err)
		}

		return
	}

	secret, ok := os.LookupEnv("SECRET")
	if !ok {
		fmt.Println("Doesn't have SECRET in enviroment variable")
	}
	admin_email, ok := os.LookupEnv("ADMIN_EMAIL")
	if !ok {
		fmt.Println("Doesn't Have ADMIN_EMAIL")
	}
	admin_password, ok := os.LookupEnv("ADMIN_PASSWORD")
	if !ok {
		fmt.Println("Doesn't have ADMIN_PASSWORD")
	}

	_ = os.MkdirAll(uploadDir, 0777)

	dbQuery := database.New(db)
	cfg := Config{
		db:             dbQuery,
		secret:         secret,
		admin_email:    admin_email,
		admin_password: admin_password,
	}
	setUpDB(db, &cfg)

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001", "*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-Requested-With"},
		AllowCredentials: true,
	}))

	r.Static("/upload", uploadDir)
	r.GET("/checkAuth", func(ctx *gin.Context) {
		checkAuth(&cfg, ctx)
	})
	r.POST("/user", func(ctx *gin.Context) {
		createUser(&cfg, ctx)
	})
	r.GET("/user", func(ctx *gin.Context) {
		getUser(&cfg, ctx)
	})
	r.GET("/user/:id", func(ctx *gin.Context) {
		GetUserByID(&cfg, ctx)
	})
	r.POST("/user/login", func(ctx *gin.Context) {
		loginUser(&cfg, ctx)
	})
	r.GET("/user/logout", func(ctx *gin.Context) {
		logoutUser(&cfg, ctx)
	})
	r.GET("/user/bill", func(ctx *gin.Context) {
		GetUserBill(&cfg, ctx)
	})
	r.GET("/user/bill/:id", func(ctx *gin.Context) {
		GetUserBillByID(&cfg, ctx)
	})

	r.POST("/gallery", func(ctx *gin.Context) {
		BookGallery(&cfg, ctx)
	})
	r.GET("/gallery", func(ctx *gin.Context) {
		listBooking(&cfg, ctx)
	})
	r.DELETE("/gallery/:name", func(ctx *gin.Context) {
		DeleteGallery(&cfg, ctx)
	})

	r.GET("/menu", func(ctx *gin.Context) {
		GetAllMenu(&cfg, ctx)
	})
	r.POST("/menu", func(ctx *gin.Context) {
		AddNewMenu(&cfg, ctx)
	})

	r.GET("/menu/id/:id", GetMenu(&cfg))
	r.GET("/menu/name/:name", GetMenu(&cfg))

	r.DELETE("/menu/id/:id", func(ctx *gin.Context) {
		DeleteMenuByID(&cfg, ctx)
	})
	r.DELETE("/menu/name/:name", func(ctx *gin.Context) {
		DeleteMenuByName(&cfg, ctx)
	})

	r.PUT("/menu/id/:id", UpdateMenu(&cfg))
	r.PUT("/menu/name/:name", UpdateMenu(&cfg))

	r.GET("/giveAway", func(ctx *gin.Context) {
		GetAllGiveAways(&cfg, ctx)
	})
	r.POST("/giveAway", func(ctx *gin.Context) {
		AddNewGiveAway(&cfg, ctx)
	})
	r.PUT("/giveAway/id/:id", func(ctx *gin.Context) {
		UpdateGiveAway(&cfg, ctx)
	})
	r.PUT("/giveAway/name/:name", func(ctx *gin.Context) {
		UpdateGiveAway(&cfg, ctx)
	})

	r.POST("/bill", func(ctx *gin.Context) {
		CreateNewBill(&cfg, ctx)
	})
	r.GET("/bill", func(ctx *gin.Context) {
		GetBill(&cfg, ctx)
	})
	r.GET("/bill/:id", func(ctx *gin.Context) {
		GetBillByID(&cfg, ctx)
	})
	r.GET("/bill/:id/update", func(ctx *gin.Context) {
		UpdateBillStatus(&cfg, ctx)
	})
	r.DELETE("/bill/:id", func(ctx *gin.Context) {
		DeleteBillByID(&cfg, ctx)
	})

	r.GET("/reset", func(ctx *gin.Context) {
		err := cfg.db.DeleteAllUser(ctx.Request.Context())
		err = cfg.db.DeleteGallery(ctx.Request.Context())
		err = cfg.db.DeleteAllMenu(ctx.Request.Context())
		err = cfg.db.DeleteGiveAways(ctx.Request.Context())
		err = cfg.db.DeleteBill(ctx.Request.Context())
		err = cfg.db.DeleteIMG(ctx.Request.Context())

		if err != nil {
			ctx.Error(err)
			ctx.String(http.StatusInternalServerError, "Can't reset data")
			return
		}
		ctx.JSON(200, gin.H{
			"msg": "Reset Success",
		})
	})
	r.Run()
}

func setUpDB(db *sql.DB, cfg *Config) {
	_, err := db.Exec(enableForeignKey)
	if err != nil {
		fmt.Println("Enable Foreign Key error", err)
		os.Exit(1)
	}

	goose.SetBaseFS(embedMigration)
	if err := goose.SetDialect("sqlite"); err != nil {
		panic(err)
	}

	if err := goose.Up(db, "sql/schema"); err != nil {
		panic(err)
	}

	var fk_enable int
	row := db.QueryRow("pragma foreign_keys;")
	err = row.Scan(&fk_enable)
	if err != nil {
		panic(err)
	}
	fmt.Println("Foreign status : ", fk_enable == 1)

	admin_uuid := uuid.New()
	hash_password, _ := auth.HashPassword(&cfg.admin_password)

	_, err = db.Exec(`
		INSERT INTO users (user_id, FName, LName, email, password, role)
		VALUES (?, ?, ?, ?, ?, 'admin')
		ON CONFLICT(email) DO NOTHING;
	`, admin_uuid.String(), "admin", "admin", cfg.admin_email, hash_password)

	if err != nil {
		log.Fatalf("Add Admin error: %v", err)
	}
}
