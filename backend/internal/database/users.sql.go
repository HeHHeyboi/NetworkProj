// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package database

import (
	"context"
	"database/sql"
)

const createAdmin = `-- name: CreateAdmin :exec
INSERT INTO users(user_id,FName,LName,email,password,role)
VALUES( ?, ?, ?, ?, ?,'admin')
`

type CreateAdminParams struct {
	UserID   interface{}
	Fname    sql.NullString
	Lname    sql.NullString
	Email    string
	Password string
}

func (q *Queries) CreateAdmin(ctx context.Context, arg CreateAdminParams) error {
	_, err := q.db.ExecContext(ctx, createAdmin,
		arg.UserID,
		arg.Fname,
		arg.Lname,
		arg.Email,
		arg.Password,
	)
	return err
}

const createUser = `-- name: CreateUser :exec
INSERT INTO users(user_id, FName, LName, email, password)
VALUES( ?, ?, ?, ?, ?)
`

type CreateUserParams struct {
	UserID   interface{}
	Fname    sql.NullString
	Lname    sql.NullString
	Email    string
	Password string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) error {
	_, err := q.db.ExecContext(ctx, createUser,
		arg.UserID,
		arg.Fname,
		arg.Lname,
		arg.Email,
		arg.Password,
	)
	return err
}

const deleteAllUser = `-- name: DeleteAllUser :exec
DELETE from users
WHERE role = 'customer'
`

func (q *Queries) DeleteAllUser(ctx context.Context) error {
	_, err := q.db.ExecContext(ctx, deleteAllUser)
	return err
}

const getAllUser = `-- name: GetAllUser :many
SELECT user_id, fname, lname, email, password, role from users
`

func (q *Queries) GetAllUser(ctx context.Context) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getAllUser)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.UserID,
			&i.Fname,
			&i.Lname,
			&i.Email,
			&i.Password,
			&i.Role,
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

const getUserByEmail = `-- name: GetUserByEmail :one
select user_id,password from users
WHERE email = ?
`

type GetUserByEmailRow struct {
	UserID   interface{}
	Password string
}

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (GetUserByEmailRow, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i GetUserByEmailRow
	err := row.Scan(&i.UserID, &i.Password)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
select user_id, fname, lname, email, password, role from users
Where user_id = ?
`

func (q *Queries) GetUserByID(ctx context.Context, userID interface{}) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, userID)
	var i User
	err := row.Scan(
		&i.UserID,
		&i.Fname,
		&i.Lname,
		&i.Email,
		&i.Password,
		&i.Role,
	)
	return i, err
}
