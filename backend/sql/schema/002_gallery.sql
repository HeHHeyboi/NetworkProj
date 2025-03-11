-- +goose Up
CREATE TABLE IF NOT EXISTS gallery(
	Gname TEXT PRIMARY KEY NOT NULL,
	StartDate TEXT NOT NULL,
	EndDate TEXT NOT NULL,
	DESC TEXT,
	user_id UUID,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE gallery;
