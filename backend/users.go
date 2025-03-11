package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/auth"
	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type User struct {
	UserID   uuid.UUID `json:"id"`
	Fname    string    `json:"first_name" form:"first_name" binding:"required"`
	Lname    string    `json:"last_name" form:"last_name" binding:"required"`
	Email    string    `json:"email" form:"email" binding:"required"`
	Password string    `json:"password" form:"password" binding:"required"`
}

func createUser(cfg *Config, ctx *gin.Context) {

	var user User
	var err error

	if err = ctx.ShouldBind(&user); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	user.UserID = uuid.New()
	user.Password, err = auth.HashPassword(&user.Password)
	if err != nil {
		ctx.JSON(401, gin.H{"error": fmt.Sprintf("data Error: %v", err)})
		ctx.Error(err)
		return
	}

	err = cfg.db.CreateUser(ctx.Request.Context(), database.CreateUserParams{
		UserID:   user.UserID,
		Fname:    sql.NullString{String: user.Fname, Valid: user.Fname != ""},
		Lname:    sql.NullString{String: user.Lname, Valid: user.Lname != ""},
		Email:    user.Email,
		Password: user.Password,
	})
	if err != nil {
		msg := checkDataBaseError(err)
		ctx.JSON(401, gin.H{"error": msg})
		ctx.Error(err)
		return
	}
	ctx.JSON(201, user)
}

func getUser(cfg *Config, ctx *gin.Context) {
	data, err := cfg.db.GetAllUser(ctx.Request.Context())
	if err != nil {
		ctx.JSON(401, gin.H{"error": err.Error()})
		return
	}
	var users []User
	for _, v := range data {
		id, err := uuid.Parse(v.UserID.(string))
		if err != nil {
			ctx.IndentedJSON(401, gin.H{"error": err.Error()})
		}
		user := User{
			UserID:   id,
			Fname:    v.Fname.String,
			Lname:    v.Lname.String,
			Email:    v.Email,
			Password: v.Password,
		}
		users = append(users, user)
	}

	ctx.JSON(http.StatusOK, users)
}

func GetUserByID(cfg *Config, ctx *gin.Context) {
	user_id := ctx.Param("id")

	data, err := cfg.db.GetUserByID(ctx.Request.Context(), user_id)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += "Email, Please Create User"
		}
		ctx.JSON(404, gin.H{"error": msg})
		return
	}

	ctx.JSON(200, gin.H{
		"id":         data.UserID,
		"first_name": data.Fname.String,
		"last_name":  data.Lname.String,
		"email":      data.Email,
	})
}

func loginUser(cfg *Config, ctx *gin.Context) {
	type Param struct {
		Email    string `json:"email" form:"email" binding:"required"`
		Password string `json:"password" form:"password" binding:"required"`
	}

	var param Param
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	data, err := cfg.db.GetUserByEmail(ctx.Request.Context(), param.Email)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			msg += "Email, Please Create User"
		}
		ctx.JSON(404, gin.H{"error": msg})
		return
	}

	ok := auth.ComparePassword(&param.Password, &data.Password)
	if !ok {
		ctx.JSON(401, gin.H{"Authentication": fmt.Sprint("Incorrect Password")})
		return
	}

	cookie, err := auth.CreateCookie("id", data.UserID.(string), cfg.secret)
	if err != nil {
		ctx.Status(500)
		ctx.Error(err)
		return
	}

	fmt.Printf("cookie: %v\n", cookie)
	http.SetCookie(ctx.Writer, cookie)
	ctx.JSON(201, gin.H{"msg": "Login success"})
}

func logoutUser(cfg *Config, ctx *gin.Context) {
	_, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.JSON(status, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	fmt.Println("user logout")
	ctx.SetCookie("id", "", -1, "/", "localhost", false, false)
	ctx.JSON(200, gin.H{"msg": "logout success"})
}

func GetUserBill(cfg *Config, ctx *gin.Context) {
	user_id, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}

	datas, err := cfg.db.GetUserBill(ctx.Request.Context(), user_id)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}
	var bills []Bill

	for _, data := range datas {
		orders_data, _ := cfg.db.GetOrderFromBill(ctx.Request.Context(), data.BillID)
		var orders []Order
		var total float64
		for _, order_data := range orders_data {
			total += order_data.TotalPrice
			order := Order{
				Menu_ID:    order_data.MenuID,
				Amount:     order_data.Amount,
				TotalPrice: order_data.TotalPrice,
			}

			orders = append(orders, order)
		}

		bill := Bill{
			Bill_ID:    data.BillID,
			UserID:     data.UserID.(string),
			GiveAwayID: data.GiveawayID.Int64,
			Total:      total,
			PayDate:    data.PayDate,
			Orders:     orders,
		}

		bills = append(bills, bill)
	}

	ctx.JSON(200, bills)
}

func GetUserBillByID(cfg *Config, ctx *gin.Context) {
	user_id, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}
	bill_id := ctx.Param("id")
	bill_data, err := cfg.db.GetUserBillByID(ctx.Request.Context(), database.GetUserBillByIDParams{
		UserID: user_id,
		BillID: bill_id,
	})
	order_data, err := cfg.db.GetOrderFromBill(ctx.Request.Context(), bill_data.BillID)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}

	var orders []Order
	for _, v := range order_data {
		order := Order{
			Menu_ID:    v.MenuID,
			Amount:     v.Amount,
			TotalPrice: v.TotalPrice,
		}
		orders = append(orders, order)
	}

	bill := Bill{
		Bill_ID:    bill_data.BillID,
		Total:      bill_data.Total,
		UserID:     bill_data.UserID.(string),
		GiveAwayID: bill_data.GiveawayID.Int64,
		PayDate:    bill_data.PayDate,
		Orders:     orders,
	}

	ctx.JSON(200, bill)
}

func checkCookie(cfg *Config, ctx *gin.Context) (string, int, error) {
	cookie, err := ctx.Request.Cookie("id")
	if err != nil {
		return "0", 400, fmt.Errorf("User didn't login")
	}

	id, err := auth.ReadCookie(cookie, cfg.secret)
	if err != nil {
		return "0", 400, fmt.Errorf("Invalid Cookie")
	}

	data, err := cfg.db.GetUserByID(ctx.Request.Context(), id)
	if data.UserID == nil {
		return "0", 400, fmt.Errorf("Please Login first")
	}
	return data.UserID.(string), 201, nil
}

func checkAuth(cfg *Config, ctx *gin.Context) {
	_, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.String(status, err.Error())
		fmt.Println(err)
		ctx.Error(err)
		return
	}

	ctx.Status(status)
}
