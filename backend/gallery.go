package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type Gallery struct {
	Name        string    `form:"name" json:"name" binding:"required"`
	Startdate   string    `form:"start_date" json:"start_date" binding:"required"`
	Enddate     string    `form:"end_date" json:"end_date" binding:"required"`
	Description string    `form:"description" json:"description" binding:"required"`
	UserID      uuid.UUID `json:"user_id"`
	Img_url     []string  `json:"img_url"`
}

func BookGallery(cfg *Config, ctx *gin.Context) {
	var param Gallery

	user_id, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.JSON(status, gin.H{"error": err.Error()})
		ctx.Error(err)
		return
	}

	if err = ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	start_date, err := time.Parse(time.DateOnly, param.Startdate)
	end_date, err := time.Parse(time.DateOnly, param.Enddate)
	if err != nil {
		ctx.JSON(400, gin.H{"error": fmt.Sprintf("Parse Time Error: %v", err)})
		return
	}

	data, err := cfg.db.BookGallery(ctx.Request.Context(), database.BookGalleryParams{
		Gname:     param.Name,
		Startdate: start_date.Format(time.DateOnly),
		Enddate:   end_date.Format(time.DateOnly),
		Desc: sql.NullString{
			String: param.Description,
			Valid:  (param.Description != ""),
		},
		UserID: user_id,
	})

	if err != nil {
		msg := "Booking Error: " + checkDataBaseError(err)
		ctx.JSON(401, gin.H{"error": msg})
		ctx.Error(fmt.Errorf("%v", msg))
		return
	}
	url, _ := uploadIMG(cfg, ctx, uploadIMGArg{gallery_name: data.Gname})

	book := Gallery{
		data.Gname,
		data.Startdate,
		data.Enddate,
		data.Desc.String,
		uuid.MustParse(data.UserID.(string)),
		url,
	}
	ctx.JSON(201, book)
}

func listBooking(cfg *Config, ctx *gin.Context) {
	month := ctx.DefaultQuery("month", "none")
	// fmt.Println(month)

	var data []database.Gallery
	var err error

	if month != "none" {
		data, err = cfg.db.ListGalleryByMonth(ctx.Request.Context(), month)
	} else {
		data, err = cfg.db.ListGallery(ctx.Request.Context())
	}
	if err != nil {
		ctx.JSON(500, gin.H{"error": "List Booking Error"})
		ctx.Error(err)
	}

	var galleries []Gallery
	for _, book := range data {
		url, _ := getImage(cfg, ctx, uploadIMGArg{gallery_name: book.Gname})
		gallery := Gallery{
			Name:        book.Gname,
			Startdate:   book.Startdate,
			Enddate:     book.Enddate,
			Description: book.Desc.String,
			UserID:      uuid.MustParse(book.UserID.(string)),
			Img_url:     url,
		}
		galleries = append(galleries, gallery)
	}
	ctx.JSON(http.StatusOK, galleries)
}

func DeleteGallery(cfg *Config, ctx *gin.Context) {
	gallery_name := ctx.Param("name")

	err := cfg.db.DeleteGalleryByGname(ctx.Request.Context(), gallery_name)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += "Email, Please Create User"
			ctx.JSON(404, gin.H{"error": msg})
			return
		}
		ctx.JSON(500, gin.H{"error": msg})
		return
	}

	deleteIMG(cfg, ctx, uploadIMGArg{gallery_name: gallery_name})
	ctx.Status(200)
}
