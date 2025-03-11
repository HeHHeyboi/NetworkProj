package main

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type GiveAway struct {
	ID     int64     `json:"id"`
	Name   string    `json:"name"`
	Amount int64     `json:"amount"`
	Remain int64     `json:"remain"`
	Desc   string    `json:"desc"`
	Date   time.Time `json:"date"`
	ImgUrl []string  `json:"img_url"`
}

func AddNewGiveAway(cfg *Config, ctx *gin.Context) {
	type Param struct {
		Name   string `json:"name" form:"name" binding:"required"`
		Desc   string `json:"desc" form:"desc"`
		Amount int    `json:"amount" form:"amount" binding:"required"`
	}

	var param Param
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	data, err := cfg.db.AddNewGiveAway(ctx.Request.Context(), database.AddNewGiveAwayParams{
		Name:   param.Name,
		Amount: int64(param.Amount),
		Remain: int64(param.Amount),
		Desc: sql.NullString{
			String: param.Desc,
			Valid:  param.Desc != "",
		},
		Date: time.Now().Format(time.DateOnly),
	})

	url, _ := uploadIMG(cfg, ctx, uploadIMGArg{giveAway_id: data.ID})
	if err != nil {
		errMsg := checkDataBaseError(err)
		ctx.JSON(500, gin.H{"error": errMsg})
		ctx.Error(err)
		return
	}

	ctx.JSON(201, gin.H{
		"id":      data.ID,
		"name":    data.Name,
		"amount":  data.Amount,
		"remain":  data.Remain,
		"desc":    data.Desc.String,
		"date":    data.Date,
		"img_url": url,
	})
}

func GetAllGiveAways(cfg *Config, ctx *gin.Context) {
	query_id := ctx.DefaultQuery("id", "-1")
	name := ctx.DefaultQuery("name", "")
	id, err := strconv.Atoi(query_id)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "invalid id"})
		return
	}

	if name != "" {
		data, err := cfg.db.GetGiveAwayByName(ctx.Request.Context(), name)
		date, err := time.Parse(time.DateOnly, data.Date.(string))
		if err != nil {
			msg := checkDataBaseError(err)
			ctx.JSON(500, gin.H{"error": msg})
		}
		url, err := getImage(cfg, ctx, uploadIMGArg{giveAway_id: data.ID})
		giveAway := GiveAway{
			ID:     data.ID,
			Name:   data.Name,
			Amount: data.Amount,
			Remain: data.Remain,
			Desc:   data.Desc.String,
			Date:   date,
			ImgUrl: url,
		}
		ctx.JSON(200, giveAway)
		return
	} else if id != -1 {
		data, err := cfg.db.GetGiveAwayByID(ctx.Request.Context(), int64(id))
		date, err := time.Parse(time.DateOnly, data.Date.(string))
		if err != nil {
			msg := checkDataBaseError(err)
			ctx.JSON(500, gin.H{"error": msg})
		}
		url, err := getImage(cfg, ctx, uploadIMGArg{giveAway_id: data.ID})
		giveAway := GiveAway{
			ID:     data.ID,
			Name:   data.Name,
			Amount: data.Amount,
			Remain: data.Remain,
			Desc:   data.Desc.String,
			Date:   date,
			ImgUrl: url,
		}
		ctx.JSON(200, giveAway)
		return
	}

	data, err := cfg.db.GetAllGiveAways(ctx.Request.Context())

	if err != nil {
		msg := checkDataBaseError(err)
		ctx.JSON(500, gin.H{"error": msg})
		return
	}

	var giveAways []GiveAway

	for _, v := range data {
		date, err := time.Parse(time.DateOnly, v.Date.(string))
		if err != nil {
			fmt.Println("Parse Time error: ", err)
		}
		url, err := getImage(cfg, ctx, uploadIMGArg{giveAway_id: v.ID})
		g := GiveAway{
			ID:     v.ID,
			Name:   v.Name,
			Amount: v.Amount,
			Remain: v.Remain,
			Desc:   v.Desc.String,
			Date:   date,
			ImgUrl: url,
		}

		giveAways = append(giveAways, g)
	}
	ctx.JSON(200, giveAways)
}

func UpdateGiveAway(cfg *Config, ctx *gin.Context) {
	_, id_exist := ctx.Params.Get("id")
	if id_exist {
		updateGiveAwayByID(cfg, ctx)
	} else {
		updateGiveAwayByName(cfg, ctx)
	}
}

func updateGiveAwayByID(cfg *Config, ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, "Invalid id")
		return
	}

	type Param struct {
		Name   string `json:"name"`
		Amount int64  `json:"amount"`
		Desc   string `json:"desc"`
	}

	var param Param
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	data, err := cfg.db.UpdateGiveAwayByID(ctx.Request.Context(), database.UpdateGiveAwayByIDParams{
		Name:   param.Name,
		Amount: param.Amount,
		Remain: param.Amount,
		Desc: sql.NullString{
			String: param.Desc,
			Valid:  param.Desc != "",
		},
		ID: int64(id),
	})

	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("giveAway ที่มี id %d", id)
			ctx.JSON(404, gin.H{"error": msg})
			return
		}
		ctx.JSON(500, gin.H{"error": msg})
		return
	}

	url, err := updateIMG(cfg, ctx, uploadIMGArg{giveAway_id: data.ID})
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{
		"id":      data.ID,
		"name":    data.Name,
		"amount":  data.Amount,
		"remain":  data.Remain,
		"desc":    data.Desc.String,
		"date":    data.Date,
		"img_url": url,
	})
}

func updateGiveAwayByName(cfg *Config, ctx *gin.Context) {
	name := ctx.Param("name")

	type Param struct {
		SetName string `json:"set_name"`
		Amount  int64  `json:"amount"`
		Desc    string `json:"desc"`
	}

	var param Param
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}
	fmt.Println(param)

	data, err := cfg.db.UpdateGiveAwayByName(ctx.Request.Context(), database.UpdateGiveAwayByNameParams{
		Setname: param.SetName,
		Amount:  param.Amount,
		Remain:  param.Amount,
		Desc: sql.NullString{
			String: param.Desc,
			Valid:  param.Desc != "",
		},
		Name: name,
	})
	fmt.Println(data)

	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("giveAway ที่มีชื่อ %s", name)
		}

		ctx.JSON(404, gin.H{"err": msg})
		return
	}

	url, err := updateIMG(cfg, ctx, uploadIMGArg{giveAway_id: data.ID})
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{
		"id":      data.ID,
		"name":    data.Name,
		"amount":  data.Amount,
		"remain":  data.Remain,
		"desc":    data.Desc.String,
		"date":    data.Date,
		"img_url": url,
	})
}
