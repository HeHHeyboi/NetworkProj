// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: give_away.sql

package database

import (
	"context"
	"database/sql"
)

const addNewGiveAway = `-- name: AddNewGiveAway :one
INSERT INTO giveAway(name, amount, remain, desc, date)
VALUES (?, ?, ?, ?, date(?))
RETURNING id, name, amount, remain, "desc", date
`

type AddNewGiveAwayParams struct {
	Name   string
	Amount int64
	Remain int64
	Desc   sql.NullString
	Date   interface{}
}

func (q *Queries) AddNewGiveAway(ctx context.Context, arg AddNewGiveAwayParams) (GiveAway, error) {
	row := q.db.QueryRowContext(ctx, addNewGiveAway,
		arg.Name,
		arg.Amount,
		arg.Remain,
		arg.Desc,
		arg.Date,
	)
	var i GiveAway
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Amount,
		&i.Remain,
		&i.Desc,
		&i.Date,
	)
	return i, err
}

const deleteByID = `-- name: DeleteByID :exec
DELETE FROM giveAway
WHERE id = ?
`

func (q *Queries) DeleteByID(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteByID, id)
	return err
}

const deleteByName = `-- name: DeleteByName :exec
DELETE FROM giveAway
WHERE name = ?
`

func (q *Queries) DeleteByName(ctx context.Context, name string) error {
	_, err := q.db.ExecContext(ctx, deleteByName, name)
	return err
}

const deleteByRemain = `-- name: DeleteByRemain :exec
DELETE FROM giveAway
WHERE remain = 0
`

func (q *Queries) DeleteByRemain(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, deleteByRemain)
	return err
}

const deleteGiveAways = `-- name: DeleteGiveAways :exec
DELETE FROM giveAway
`

func (q *Queries) DeleteGiveAways(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, deleteGiveAways)
	return err
}

const getAllGiveAways = `-- name: GetAllGiveAways :many
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway
`

type GetAllGiveAwaysRow struct {
	ID     int64
	Name   string
	Amount int64
	Remain int64
	Desc   sql.NullString
	Date   interface{}
}

func (q *Queries) GetAllGiveAways(ctx context.Context) ([]GetAllGiveAwaysRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllGiveAways)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllGiveAwaysRow
	for rows.Next() {
		var i GetAllGiveAwaysRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Amount,
			&i.Remain,
			&i.Desc,
			&i.Date,
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

const getGiveAwayByID = `-- name: GetGiveAwayByID :one
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway
WHERE id = ?
`

type GetGiveAwayByIDRow struct {
	ID     int64
	Name   string
	Amount int64
	Remain int64
	Desc   sql.NullString
	Date   interface{}
}

func (q *Queries) GetGiveAwayByID(ctx context.Context, id int64) (GetGiveAwayByIDRow, error) {
	row := q.db.QueryRowContext(ctx, getGiveAwayByID, id)
	var i GetGiveAwayByIDRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Amount,
		&i.Remain,
		&i.Desc,
		&i.Date,
	)
	return i, err
}

const getGiveAwayByName = `-- name: GetGiveAwayByName :one
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway
WHERE name = ?
`

type GetGiveAwayByNameRow struct {
	ID     int64
	Name   string
	Amount int64
	Remain int64
	Desc   sql.NullString
	Date   interface{}
}

func (q *Queries) GetGiveAwayByName(ctx context.Context, name string) (GetGiveAwayByNameRow, error) {
	row := q.db.QueryRowContext(ctx, getGiveAwayByName, name)
	var i GetGiveAwayByNameRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Amount,
		&i.Remain,
		&i.Desc,
		&i.Date,
	)
	return i, err
}

const updateGiveAwayByID = `-- name: UpdateGiveAwayByID :one
UPDATE giveAway
SET name=?, amount=?, desc=?,remain=?
WHERE id = ?
RETURNING id, name, amount, remain, "desc", date
`

type UpdateGiveAwayByIDParams struct {
	Name   string
	Amount int64
	Desc   sql.NullString
	Remain int64
	ID     int64
}

func (q *Queries) UpdateGiveAwayByID(ctx context.Context, arg UpdateGiveAwayByIDParams) (GiveAway, error) {
	row := q.db.QueryRowContext(ctx, updateGiveAwayByID,
		arg.Name,
		arg.Amount,
		arg.Desc,
		arg.Remain,
		arg.ID,
	)
	var i GiveAway
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Amount,
		&i.Remain,
		&i.Desc,
		&i.Date,
	)
	return i, err
}

const updateGiveAwayByName = `-- name: UpdateGiveAwayByName :one
UPDATE giveAway
SET name=?, amount=?, desc=?,remain=?
WHERE name=?
RETURNING id, name, amount, remain, "desc", date
`

type UpdateGiveAwayByNameParams struct {
	Setname string
	Amount  int64
	Desc    sql.NullString
	Remain  int64
	Name    string
}

func (q *Queries) UpdateGiveAwayByName(ctx context.Context, arg UpdateGiveAwayByNameParams) (GiveAway, error) {
	row := q.db.QueryRowContext(ctx, updateGiveAwayByName,
		arg.Setname,
		arg.Amount,
		arg.Desc,
		arg.Remain,
		arg.Name,
	)
	var i GiveAway
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Amount,
		&i.Remain,
		&i.Desc,
		&i.Date,
	)
	return i, err
}

const updateGiveAwayRemain = `-- name: UpdateGiveAwayRemain :exec
UPDATE giveAway
SET remain = remain - 1
WHERE id = ?
`

func (q *Queries) UpdateGiveAwayRemain(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, updateGiveAwayRemain, id)
	return err
}
