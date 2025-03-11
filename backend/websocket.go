package main

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
)

func handleWebSocket(ctx *gin.Context) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		fmt.Println("WebSocket Upgrade Error", err)
		return
	}

	defer conn.Close()

	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			break
		}
	}
}

func broadcastUpdateTodos(cfg *Config) {
	datas, err := cfg.db.GetToDo(context.Background())
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	var todos []Todo
	for _, data := range datas {
		todos = append(todos, Todo{
			Id:       data.ID,
			Name:     data.Name,
			Complete: data.Complete.Bool,
		})
	}

	mutex.Lock()
	for client := range clients {
		err := client.WriteJSON(todos)
		if err != nil {
			client.Close()
			delete(clients, client)
		}
	}
	mutex.Unlock()
}
