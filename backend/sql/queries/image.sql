-- name: AddNewIMG :one
INSERT INTO image(menu_id, giveAway_id, gallery_name,img_url)
VALUES (?,?,?,?)
RETURNING *;

-- name: GetMenuIMG :many
select img_url from image
WHERE menu_id = ?;

-- name: GetGiveAwayIMG :many
select img_url from image
WHERE giveAway_id = ?;

-- name: GetGalleryNameIMG :many
select img_url from image
WHERE gallery_name = ?;

-- name: DeleteOneIMG :exec
DELETE FROM image
WHERE (menu_id = ? OR giveAway_id = ? OR gallery_name = ?) AND img_url = ?;

-- name: DeleteIMGFromKey :many
DELETE FROM image
WHERE menu_id = ? OR giveAway_id = ? OR gallery_name = ?
RETURNING img_url;

-- name: DeleteIMG :exec
DELETE FROM image;
