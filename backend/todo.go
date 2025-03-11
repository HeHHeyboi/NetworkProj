package main

import (
	"strconv"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
)

type Todo struct {
	Id       int64  `json:"id"`
	Name     string `json:"name"`
	Complete bool   `json:"complete"`
}

func getTODO(cfg *Config, ctx *gin.Context) {
	datas, err := cfg.db.GetToDo(ctx.Request.Context())
	if err != nil {
		ctx.JSON(500, gin.H{"err": err.Error()})
		return
	}

	var todos []Todo

	for _, data := range datas {
		todo := Todo{
			Id:       data.ID,
			Name:     data.Name,
			Complete: data.Complete.Bool,
		}

		todos = append(todos, todo)
	}

	ctx.JSON(200, todos)
}
func createTODO(cfg *Config, ctx *gin.Context) {
	type Param struct {
		Name string `json:"name"`
	}

	var param Param

	if err := ctx.ShouldBind(&param); err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	err := cfg.db.CreateToDo(ctx.Request.Context(), param.Name)
	if err != nil {
		ctx.JSON(500, gin.H{"err": err.Error()})
		return
	}

	ctx.Status(201)

}
func updateTODO(cfg *Config, ctx *gin.Context) {
	id_param := ctx.Param("id")

	id, err := strconv.Atoi(id_param)
	if err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	type Param struct {
		Name string `json:"name"`
	}

	var param Param

	if err := ctx.ShouldBind(&param); err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	err = cfg.db.UpdateToDo(ctx.Request.Context(), database.UpdateToDoParams{
		Name: param.Name,
		ID:   int64(id),
	})

	if err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	ctx.Status(204)
}
func deleteTODO(cfg *Config, ctx *gin.Context) {
	id_param := ctx.Param("id")

	id, err := strconv.Atoi(id_param)
	if err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	err = cfg.db.DeleteToDo(ctx.Request.Context(), int64(id))
	if err != nil {
		ctx.JSON(500, gin.H{"err": err.Error()})
		return
	}

	ctx.Status(204)
}
