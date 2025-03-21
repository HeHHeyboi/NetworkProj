package main

import (
	"fmt"
	"strconv"

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
		fmt.Println(err)
		ctx.JSON(500, gin.H{"err": err.Error()})
		return
	}

	broadcastUpdateTodos(cfg)
	ctx.Status(201)

}
func updateTODO(cfg *Config, ctx *gin.Context) {
	id_param := ctx.Param("id")

	id, err := strconv.Atoi(id_param)
	if err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	err = cfg.db.UpdateToDo(ctx.Request.Context(), int64(id))

	if err != nil {
		ctx.JSON(400, gin.H{"err": err.Error()})
		return
	}

	broadcastUpdateTodos(cfg)
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
		fmt.Println(err)
		ctx.JSON(500, gin.H{"err": err.Error()})
		return
	}
	broadcastUpdateTodos(cfg)
	ctx.Status(204)
}
