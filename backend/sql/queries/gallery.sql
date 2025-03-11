-- name: ListGallery :many
select * from gallery
ORDER BY "StartDate";

-- name: ListGalleryByMonth :many
-- name: ListGalleryByMonth :many
SELECT * FROM gallery
WHERE StartDate >= CASE 
	WHEN @month IS NULL THEN date('now', 'start of month')
	ELSE date(@month || '-01') -- Convert YYYY-MM to valid date
END
AND StartDate < CASE 
	WHEN @month IS NULL THEN date('now', 'start of month', '+1 month')
	ELSE date(@month || '-01', '+1 month')
END;

-- name: BookGallery :one
INSERT INTO gallery(Gname,StartDate,EndDate,Desc,user_id) VALUES (?,?,?,?,?)
RETURNING *;

-- name: DeleteGalleryByGname :exec
DELETE FROM gallery
WHERE Gname = ?;

-- name: DeleteGallery :exec
DELETE FROM gallery;
