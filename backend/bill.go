package main

import (
	"database/sql"
	"time"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Bill struct {
	Bill_ID    string  `json:"bill_id"`
	UserID     string  `json:"user_id"`
	GiveAwayID int64   `json:"giveaway_id"`
	Total      float64 `json:"total"`
	PaidStatus bool    `json:"paid_status"`
	PayDate    string  `json:"pay_date"`
	Orders     []Order `json:"orders"`
}

type Order struct {
	Menu_ID    int64   `json:"menu_id"`
	MenuName   string  `json:"menu_name"`
	Amount     int64   `json:"amount"`
	TotalPrice float64 `json:"total_price"`
}

func CreateNewBill(cfg *Config, ctx *gin.Context) {
	type Param struct {
		Orders []struct {
			Menu_ID int64 `json:"menu_id"`
			Amount  int64 `json:"amount"`
		} `json:"orders"`
		GiveAwayID int64 `json:"giveaway_id"`
	}

	var param Param
	if err := ctx.ShouldBind(&param); err != nil {
		bindingErrorMsg(err.(validator.ValidationErrors), ctx)
		return
	}

	id, status, err := checkCookie(cfg, ctx)
	if err != nil {
		ctx.JSON(status, gin.H{"error": err.Error()})
		return
	}

	bill_data, err := cfg.db.CreateBill(ctx.Request.Context(), database.CreateBillParams{
		PayDate: time.Now().Format(time.DateTime),
		UserID:  id,
		GiveawayID: sql.NullInt64{
			Int64: param.GiveAwayID,
			Valid: param.GiveAwayID != 0,
		},
	})
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
	var total float64

	for _, v := range param.Orders {
		order_data, err := cfg.db.CreateNewOrder(ctx.Request.Context(), database.CreateNewOrderParams{
			BillID:       bill_data.BillID,
			MenuID:       v.Menu_ID,
			Amount:       v.Amount,
			CalAmount:    float64(v.Amount),
			TargetMenuID: v.Menu_ID,
		})
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			ctx.Error(err)
			return
		}
		total += order_data.TotalPrice

		order := Order{
			Menu_ID:    order_data.MenuID,
			MenuName:   order_data.MenuName,
			Amount:     order_data.Amount,
			TotalPrice: order_data.TotalPrice,
		}

		orders = append(orders, order)
	}

	bill_data, err = cfg.db.UpdateBillTotal(ctx.Request.Context(), database.UpdateBillTotalParams{
		Total:  total,
		BillID: bill_data.BillID,
	})
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}

	err = cfg.db.UpdateGiveAwayRemain(ctx.Request.Context(), bill_data.GiveawayID.Int64)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}

	bill := Bill{
		Bill_ID:    bill_data.BillID,
		UserID:     bill_data.UserID.(string),
		GiveAwayID: bill_data.GiveawayID.Int64,
		Total:      bill_data.Total,
		PaidStatus: bill_data.PaidStatus,
		PayDate:    bill_data.PayDate,
		Orders:     orders,
	}

	ctx.JSON(201, bill)
}

func GetBill(cfg *Config, ctx *gin.Context) {
	datas, err := cfg.db.ListBill(ctx.Request.Context())
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
				MenuName:   order_data.MenuName,
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
			PaidStatus: data.PaidStatus,
			PayDate:    data.PayDate,
			Orders:     orders,
		}

		bills = append(bills, bill)
	}

	ctx.JSON(200, bills)
}

func GetBillByID(cfg *Config, ctx *gin.Context) {
	id := ctx.Param("id")

	bill_data, err := cfg.db.GetBillByID(ctx.Request.Context(), id)
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
			MenuName:   v.MenuName,
			Amount:     v.Amount,
			TotalPrice: v.TotalPrice,
		}
		orders = append(orders, order)
	}

	bill := Bill{
		Bill_ID:    bill_data.BillID,
		Total:      bill_data.Total,
		UserID:     bill_data.UserID.(string),
		PaidStatus: bill_data.PaidStatus,
		GiveAwayID: bill_data.GiveawayID.Int64,
		PayDate:    bill_data.PayDate,
		Orders:     orders,
	}

	ctx.JSON(200, bill)
}

func UpdateBillStatus(cfg *Config, ctx *gin.Context) {
	bill_id := ctx.Param("id")
	bill_data, err := cfg.db.UpdateBillStatus(ctx.Request.Context(), bill_id)
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
			MenuName:   v.MenuName,
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
		PaidStatus: bill_data.PaidStatus,
		PayDate:    bill_data.PayDate,
		Orders:     orders,
	}

	ctx.JSON(200, bill)
}

func DeleteBillByID(cfg *Config, ctx *gin.Context) {
	bill_id := ctx.Param("id")

	err := cfg.db.DeleteBillByID(ctx.Request.Context(), bill_id)
	if err != nil {
		msg := checkDataBaseError(err)
		if err.Error() == noResult {
			ctx.JSON(404, gin.H{"err": msg})
			return
		}
		ctx.JSON(500, gin.H{"err": msg})
		return
	}

	ctx.Status(204)
}
