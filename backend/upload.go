package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/HeHHeyboi/Cafe_Management/backend/internal/database"
	"github.com/gin-gonic/gin"
)

type uploadIMGArg struct {
	menu_id      int64
	giveAway_id  int64
	gallery_name string
}

const image_value = "images"

func createNullVar(arg uploadIMGArg) (sql.NullInt64, sql.NullInt64, sql.NullString) {
	menu_id := sql.NullInt64{
		Int64: arg.menu_id,
		Valid: (arg.menu_id != 0),
	}

	giveAway_id := sql.NullInt64{
		Int64: arg.giveAway_id,
		Valid: arg.giveAway_id != 0,
	}

	gallery_name := sql.NullString{
		String: arg.gallery_name,
		Valid:  arg.gallery_name != "",
	}
	return menu_id, giveAway_id, gallery_name

}

func uploadIMG(cfg *Config, ctx *gin.Context, arg uploadIMGArg) ([]string, error) {
	form, err := ctx.MultipartForm()
	if err != nil {
		return nil, err
	}

	files := form.File["images"]
	menu_id, giveAway_id, gallery_name := createNullVar(arg)

	var url []string
	// var datas []database.Image
	for _, file := range files {
		ctx.SaveUploadedFile(file, uploadDir+file.Filename)
		url = append(url, uploadDir+file.Filename)
		_, err := cfg.db.AddNewIMG(ctx.Request.Context(), database.AddNewIMGParams{
			ImgUrl:      uploadDir + file.Filename,
			MenuID:      menu_id,
			GiveawayID:  giveAway_id,
			GalleryName: gallery_name,
		})

		if err != nil {
			return nil, err
		}
		// datas = append(datas, data)
	}
	// fmt.Println(datas)

	// fmt.Println("Upload IMG ", url)
	return url, nil
}

func getImage(cfg *Config, ctx *gin.Context, arg uploadIMGArg) ([]string, error) {
	var url []string
	var err error
	menu_id := sql.NullInt64{
		Int64: arg.menu_id,
		Valid: (arg.menu_id != 0),
	}

	giveAway_id := sql.NullInt64{
		Int64: arg.giveAway_id,
		Valid: arg.giveAway_id != 0,
	}

	gallery_name := sql.NullString{
		String: arg.gallery_name,
		Valid:  arg.gallery_name != "",
	}

	if menu_id.Valid {
		url, err = cfg.db.GetMenuIMG(ctx.Request.Context(), menu_id)
	} else if giveAway_id.Valid {
		url, err = cfg.db.GetGiveAwayIMG(ctx.Request.Context(), giveAway_id)
	} else if gallery_name.Valid {
		url, err = cfg.db.GetGalleryNameIMG(ctx.Request.Context(), gallery_name)
	}

	if err != nil {
		return nil, err
	}
	// fmt.Println("Get IMG ", url)

	return url, nil
}

func updateIMG(cfg *Config, ctx *gin.Context, arg uploadIMGArg) ([]string, error) {
	var old_url []string
	var err error
	menu_id, giveAway_id, gallery_name := createNullVar(arg)
	if menu_id.Valid {
		old_url, err = cfg.db.GetMenuIMG(ctx.Request.Context(), menu_id)
	} else if giveAway_id.Valid {
		old_url, err = cfg.db.GetGiveAwayIMG(ctx.Request.Context(), giveAway_id)
	} else if gallery_name.Valid {
		old_url, err = cfg.db.GetGalleryNameIMG(ctx.Request.Context(), gallery_name)
	}
	if err != nil {
		ctx.Error(err)
		return nil, err
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.Error(err)
		return nil, err
	}

	files := form.File["images"]
	var new_url []string
	for _, file := range files {
		ctx.SaveUploadedFile(file, uploadDir+file.Filename)
		new_url = append(new_url, uploadDir+file.Filename)
	}
	set_new_url := make(map[string]int)
	for _, p := range new_url {
		set_new_url[p] = 1
	}

	for _, p := range old_url {
		_, ok := set_new_url[p]
		if !ok {
			err = cfg.db.DeleteOneIMG(ctx.Request.Context(), database.DeleteOneIMGParams{
				MenuID:      menu_id,
				GiveawayID:  giveAway_id,
				GalleryName: gallery_name,
				ImgUrl:      p,
			})
			if err != nil {
				ctx.Error(err)
				return nil, fmt.Errorf("DB error: %v", err.Error())
			}
			err = os.Remove(p)
			if err != nil {
				ctx.Error(err)
				return nil, fmt.Errorf("OS error: %v", err.Error())
			}
		} else {
			set_new_url[p] -= 1
		}
	}

	for k, v := range set_new_url {
		if v != 0 {
			cfg.db.AddNewIMG(ctx.Request.Context(), database.AddNewIMGParams{
				MenuID:      menu_id,
				GiveawayID:  giveAway_id,
				GalleryName: gallery_name,
				ImgUrl:      k,
			})
			// fmt.Println("Add new IMG", data)
			continue
		}
	}
	// fmt.Println("Update IMG ", new_url)

	return new_url, nil
}

func test_updateIMG(old_url, new_url []string) []string {
	set_new_url := make(map[string]int)
	for _, p := range new_url {
		set_new_url[p] = 1
	}

	// fmt.Println(set_new_url)
	for i, p := range old_url {
		_, ok := set_new_url[p]
		if !ok {
			fmt.Printf("Found unused one at %d : %s\n", i, p)
		} else {
			set_new_url[p] -= 1
		}
	}

	for k, v := range set_new_url {
		if v != 0 {
			fmt.Println("Add New IMG:", k)
		}
	}
	return new_url
}

func deleteIMG(cfg *Config, ctx *gin.Context, arg uploadIMGArg) {
	menu_id, giveAway_id, gallery_name := createNullVar(arg)
	url, err := cfg.db.DeleteIMGFromKey(ctx.Request.Context(), database.DeleteIMGFromKeyParams{
		MenuID:      menu_id,
		GiveawayID:  giveAway_id,
		GalleryName: gallery_name,
	})
	// fmt.Println("Delete IMG ", url)
	if err != nil {
		ctx.Error(err)
	}
	for _, v := range url {
		os.Remove(v)
	}
}
