-- name: AddMenu :one
INSERT INTO menu(name,price,type,menu_type) 
VALUES(?,?,?,?)
RETURNING *;

-- name: GetAllMenus :many
SELECT * FROM menu;

-- name: GetAllType :many
SELECT type FROM menu;

-- name: GetAllMenuType :many
SELECT menu_type FROM menu;

-- name: GetMenuByName :one
SELECT * FROM menu
WHERE name = ?;

-- name: GetMenuByID :one
SELECT * FROM menu
WHERE menu_id = ?;

-- name: DeleteAllMenu :exec
DELETE FROM menu;

-- name: DeleteMenuByName :one
DELETE FROM menu
WHERE name = ?
RETURNING menu_id;

-- name: DeleteMenuByID :exec
DELETE FROM menu
WHERE menu_id = ?;

-- name: UpdateMenuByName :one
UPDATE menu
SET name = @set_name, menu_type = ? ,type = ?, price = ?
WHERE name = @name 
RETURNING *;

-- name: UpdateMenuByID :one
UPDATE menu
SET name = ?, menu_type = ? ,type = ?, price = ?
WHERE menu_id = ?
RETURNING *;

