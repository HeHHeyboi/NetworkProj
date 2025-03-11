-- name: AddNewGiveAway :one
INSERT INTO giveAway(name, amount, remain, desc, date)
VALUES (?, ?, ?, ?, date(?))
RETURNING *;

-- name: GetAllGiveAways :many
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway;

-- name: GetGiveAwayByName :one
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway
WHERE name = ?;

-- name: GetGiveAwayByID :one
SELECT id,name,amount,remain,desc,date(date) as date
FROM giveAway
WHERE id = ?;

-- name: UpdateGiveAwayByID :one
UPDATE giveAway
SET name=?, amount=?, desc=?,remain=?
WHERE id = ?
RETURNING *;

-- name: UpdateGiveAwayByName :one
UPDATE giveAway
SET name=@setname, amount=?, desc=?,remain=?
WHERE name=@name
RETURNING *;

-- name: UpdateGiveAwayRemain :exec
UPDATE giveAway
SET remain = remain - 1
WHERE id = ?;

-- name: DeleteGiveAways :exec
DELETE FROM giveAway;

-- name: DeleteByID :exec
DELETE FROM giveAway
WHERE id = ?;

-- name: DeleteByName :exec
DELETE FROM giveAway
WHERE name = ?;

-- name: DeleteByRemain :exec
DELETE FROM giveAway
WHERE remain = 0;
