-- name: CreateToDo :exec
INSERT INTO todo(name)
VALUES(?);

-- name: GetToDo :many
SELECT * FROM todo;

-- name: UpdateToDo :exec
UPDATE todo
SET complete = NOT complete
WHERE id = ?;

-- name: DeleteToDo :exec
DELETE FROM todo
WHERE id = ?;

-- name: Delete :exec
DELETE FROM todo;
