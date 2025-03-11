-- +goose Up
CREATE TABLE IF NOT EXISTS image(
	menu_id INTEGER,
	giveAway_id INTEGER,
	gallery_name TEXT,
	img_url TEXT NOT NULL
);
-- +goose Down
DROP TABLE image;

