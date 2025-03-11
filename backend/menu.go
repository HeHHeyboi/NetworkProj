package main

import (
	"database/sql"
	"fmt"
	"strconv"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Menu struct {
	MenuID   int64    `json:"menu_id"`
	Name     string   `json:"name" form:"name" binding:"required"`
	MenuType string   `json:"menu_type" form:"menu_type" binding:"required"`
	Price    float64  `json:"price" form:"price" binding:"required"`
	Type     string   `json:"type" form:"type"`
	ImgUrl   []string `json:"img_url"`
}

func AddNewMenu(cfg *Config, ctx *gin.Context) {
	type Param struct {
		Name     string  `json:"name" form:"name" binding:"required"`
		MenuType string  `json:"menu_type" form:"menu_type" binding:"required"`
		Price    float64 `json:"price" form:"price" binding:"required"`
		Type     string  `json:"type" form:"type"`
	}

	var newMenu Param
	var err error
	if err = ctx.ShouldBind(&newMenu); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	input_data := database.AddMenuParams{
		Name:  newMenu.Name,
		Price: newMenu.Price,
		Type: sql.NullString{
			String: newMenu.Type,
			Valid:  newMenu.Type != "",
		},
		MenuType: newMenu.MenuType,
	}

	if !input_data.Type.Valid {
		input_data.Type.String = "-"
		input_data.Type.Valid = true
	}

	data, err := cfg.db.AddMenu(ctx.Request.Context(), input_data)

	if err != nil {
		ctx.JSON(401, gin.H{"error": err.Error()})
		return
	}

	url, _ := uploadIMG(cfg, ctx, uploadIMGArg{
		menu_id: data.MenuID,
	})
	// if err != nil {
	// 	ctx.JSON(500, gin.H{"error": err.Error()})
	// 	ctx.Error(err)
	// 	return
	// }

	ctx.JSON(201, gin.H{
		"menu_id":   data.MenuID,
		"name":      data.Name,
		"menu_type": data.MenuType,
		"type":      data.Type,
		"price":     data.Price,
		"img_url":   url,
	})
}

func GetAllMenu(cfg *Config, ctx *gin.Context) {
	data, err := cfg.db.GetAllMenus(ctx.Request.Context())
	if err != nil {
		ctx.JSON(401, gin.H{"error": err.Error()})
		return
	}
	menus := []Menu{}
	for _, m := range data {
		url, _ := getImage(cfg, ctx, uploadIMGArg{menu_id: m.MenuID})
		menu := Menu{
			m.MenuID,
			m.Name,
			m.MenuType,
			m.Price,
			m.Type.String,
			url,
		}
		menus = append(menus, menu)
	}

	ctx.JSON(200, menus)
}

func GetMenu(c *Config) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		_, id_exist := ctx.Params.Get("id")
		if id_exist {
			getMenuByID(c, ctx)
		} else {
			getMenuByName(c, ctx)
		}
	}
}

func getMenuByName(cfg *Config, ctx *gin.Context) {
	name := ctx.Param("name")

	data, err := cfg.db.GetMenuByName(ctx.Request.Context(), name)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("menu ที่มีชื่อ %s", name)
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}

	url, err := getImage(cfg, ctx, uploadIMGArg{menu_id: data.MenuID})
	if err != nil {
		ctx.JSON(401, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"menu_id":   data.MenuID,
		"name":      data.Name,
		"menu_type": data.MenuType,
		"type":      data.Type,
		"price":     data.Price,
		"img_url":   url,
	})

}
func getMenuByID(cfg *Config, ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(500, "Invalid id")
		return
	}

	data, err := cfg.db.GetMenuByID(ctx.Request.Context(), int64(id))
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("menu ที่มี id %d", id)
		}

		ctx.JSON(404, gin.H{"err": msg})
		return
	}

	url, err := getImage(cfg, ctx, uploadIMGArg{menu_id: data.MenuID})
	if err != nil {
		ctx.JSON(401, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"menu_id":   data.MenuID,
		"name":      data.Name,
		"menu_type": data.MenuType,
		"type":      data.Type,
		"price":     data.Price,
		"img_url":   url,
	})
}

func DeleteMenuByName(cfg *Config, ctx *gin.Context) {
	name := ctx.Param("name")

	menu_id, err := cfg.db.DeleteMenuByName(ctx.Request.Context(), name)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		ctx.Error(err)
		return
	}

	deleteIMG(cfg, ctx, uploadIMGArg{menu_id: menu_id})
	ctx.JSON(204, gin.H{"msg": "Delete Success"})
}

func DeleteMenuByID(cfg *Config, ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, "Invalid id")
		return
	}

	err = cfg.db.DeleteMenuByID(ctx.Request.Context(), int64(id))
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		ctx.Error(err)
		return
	}

	deleteIMG(cfg, ctx, uploadIMGArg{menu_id: int64(id)})
	ctx.JSON(204, "Delete Success")
}

func UpdateMenu(c *Config) func(*gin.Context) {
	return func(ctx *gin.Context) {
		_, id_exist := ctx.Params.Get("id")
		if id_exist {
			updateMenuByID(c, ctx)
		} else {
			updateMenuByName(c, ctx)
		}
	}
}

func updateMenuByID(cfg *Config, ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, "Invalid id")
		return
	}

	var param Menu
	if err = ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}
	updateData := database.UpdateMenuByIDParams{
		Name:     param.Name,
		MenuType: param.MenuType,
		Type: sql.NullString{
			String: param.Type,
			Valid:  param.Type != "",
		},
		Price:  param.Price,
		MenuID: int64(id),
	}
	if !updateData.Type.Valid {
		updateData.Type.String = "-"
		updateData.Type.Valid = true
	}

	data, err := cfg.db.UpdateMenuByID(ctx.Request.Context(), updateData)

	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("menu ที่มี id %d", id)
		}

		ctx.JSON(404, gin.H{"err": msg})
		return
	}

	url, err := updateIMG(cfg, ctx, uploadIMGArg{menu_id: data.MenuID})
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"menu_id":   data.MenuID,
		"name":      data.Name,
		"menu_type": data.MenuType,
		"type":      data.Type,
		"price":     data.Price,
		"img_url":   url,
	})
}

func updateMenuByName(cfg *Config, ctx *gin.Context) {
	name := ctx.Param("name")

	var param Menu
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	updateData := database.UpdateMenuByNameParams{
		SetName:  param.Name,
		MenuType: param.MenuType,
		Type: sql.NullString{
			String: param.Type,
			Valid:  param.Type != "",
		},
		Price: param.Price,
		Name:  name,
	}
	if !updateData.Type.Valid {
		updateData.Type.String = "-"
		updateData.Type.Valid = true
	}

	data, err := cfg.db.UpdateMenuByName(ctx.Request.Context(), updateData)

	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += fmt.Sprintf("menu ที่มีชื่อ %s", name)
		}

		ctx.JSON(404, gin.H{"err": msg})
		return
	}

	url, err := updateIMG(cfg, ctx, uploadIMGArg{menu_id: data.MenuID})
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"menu_id":   data.MenuID,
		"name":      data.Name,
		"menu_type": data.MenuType,
		"type":      data.Type,
		"price":     data.Price,
		"img_url":   url,
	})
}
