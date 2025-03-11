-- +goose Up
CREATE TABLE IF NOT EXISTS users(
	user_id UUID PRIMARY KEY NOT NULL, 
	FName TEXT,
	LName TEXT,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL
);

-- +goose Down
DROP TABLE users;
