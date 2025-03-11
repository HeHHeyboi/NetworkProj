// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: gallery.sql

package database

import (
	"context"
	"database/sql"
)

const bookGallery = `-- name: BookGallery :one
INSERT INTO gallery(Gname,StartDate,EndDate,Desc,user_id) VALUES (?,?,?,?,?)
RETURNING gname, startdate, enddate, "desc", user_id
`

type BookGalleryParams struct {
	Gname     string
	Startdate string
	Enddate   string
	Desc      sql.NullString
	UserID    interface{}
}

func (q *Queries) BookGallery(ctx context.Context, arg BookGalleryParams) (Gallery, error) {
	row := q.db.QueryRowContext(ctx, bookGallery,
		arg.Gname,
		arg.Startdate,
		arg.Enddate,
		arg.Desc,
		arg.UserID,
	)
	var i Gallery
	err := row.Scan(
		&i.Gname,
		&i.Startdate,
		&i.Enddate,
		&i.Desc,
		&i.UserID,
	)
	return i, err
}

const deleteGallery = `-- name: DeleteGallery :exec
DELETE FROM gallery
`

func (q *Queries) DeleteGallery(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, deleteGallery)
	return err
}

const deleteGalleryByGname = `-- name: DeleteGalleryByGname :exec
DELETE FROM gallery
WHERE Gname = ?
`

func (q *Queries) DeleteGalleryByGname(ctx context.Context, gname string) error {
	_, err := q.db.ExecContext(ctx, deleteGalleryByGname, gname)
	return err
}

const listGallery = `-- name: ListGallery :many
select gname, startdate, enddate, "desc", user_id from gallery
ORDER BY "StartDate"
`

func (q *Queries) ListGallery(ctx context.Context) ([]Gallery, error) {
	rows, err := q.db.QueryContext(ctx, listGallery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Gallery
	for rows.Next() {
		var i Gallery
		if err := rows.Scan(
			&i.Gname,
			&i.Startdate,
			&i.Enddate,
			&i.Desc,
			&i.UserID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listGalleryByMonth = `-- name: ListGalleryByMonth :many
SELECT gname, startdate, enddate, "desc", user_id FROM gallery
WHERE StartDate >= CASE 
	WHEN ?1 IS NULL THEN date('now', 'start of month')
	ELSE date(?1 || '-01') -- Convert YYYY-MM to valid date
END
AND StartDate < CASE 
	WHEN ?1 IS NULL THEN date('now', 'start of month', '+1 month')
	ELSE date(?1 || '-01', '+1 month')
END
`

func (q *Queries) ListGalleryByMonth(ctx context.Context, month interface{}) ([]Gallery, error) {
	rows, err := q.db.QueryContext(ctx, listGalleryByMonth, month)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Gallery
	for rows.Next() {
		var i Gallery
		if err := rows.Scan(
			&i.Gname,
			&i.Startdate,
			&i.Enddate,
			&i.Desc,
			&i.UserID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
