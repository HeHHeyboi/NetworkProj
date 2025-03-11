package main

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

const (
	foreignKeyMissing = "constraint failed: FOREIGN KEY constraint failed (787)"
	usedEmail         = "constraint failed: UNIQUE constraint failed: users.email (2067)"
	noResult          = "sql: no rows in result set"
	requireTag        = "required"
)

func checkDataBaseError(err error) string {
	switch err.Error() {
	case foreignKeyMissing:
		return "Please Created User first with Email"
	case usedEmail:
		return "This email Already Used, Please login or Used other email"
	case noResult:
		return "ไม่มีข้อมูลของ"
	default:
		return err.Error()
	}
}

func bindingErrorMsg(err validator.ValidationErrors, ctx *gin.Context) {
	var msg string
	for _, e := range err {
		switch e.Tag() {
		case requireTag:
			msg = fmt.Sprint("ไม่มีข้อมูลหรือชื่อผิดที่ ", strings.ToLower(e.Field()))
		default:
			msg = e.Error()
		}
		ctx.Error(fmt.Errorf("%v", msg))
		ctx.JSON(400, gin.H{"error": msg})
	}
}
