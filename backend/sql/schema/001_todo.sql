-- +goose Up
CREATE TABLE IF NOT EXISTS todo(
	id INTEGER PRIMARY KEY NOT NULL,
	name TEXT NOT NULL,
	complete BOOLEAN DEFAULT false
);

-- +goose Down
DROP TABLE todo;
