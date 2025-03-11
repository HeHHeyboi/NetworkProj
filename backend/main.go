package main

import (
	"database/sql"
	"embed"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"

	// _ "github.com/mattn/go-sqlite3"
	_ "modernc.org/sqlite"
)

type Config struct {
	db *database.Queries
}

//go:embed sql/schema/*.sql
var embedMigration embed.FS

const enableForeignKey = `PRAGMA foreign_keys = ON;`

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
		if err != nil {
			panic(err)
		}

		return
	}

	dbQuery := database.New(db)
	cfg := Config{
		db: dbQuery,
	}
	setUpDB(db, &cfg)

	r := gin.New()
	r.Use(gin.Logger())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "X-Requested-With"},
		AllowCredentials: true,
	}))

	r.GET("/todo", func(ctx *gin.Context) {
		getTODO(&cfg, ctx)
	})
	r.POST("/todo", func(ctx *gin.Context) {
		createTODO(&cfg, ctx)
	})
	r.DELETE("/todo/:id", func(ctx *gin.Context) {
		deleteTODO(&cfg, ctx)
	})
	r.PUT("/todo/:id", func(ctx *gin.Context) {
		updateTODO(&cfg, ctx)
	})
	r.GET("/reset", func(ctx *gin.Context) {
		cfg.db.Delete(ctx.Request.Context())
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
}
