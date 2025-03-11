-- +goose Up
CREATE TABLE IF NOT EXISTS bill(
	bill_id TEXT NOT NULL PRIMARY KEY,
	total FLOAT NOT NULL,
	pay_date TEXT NOT NULL,
	user_id UUID,
	giveAway_id INTEGER,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- +goose Down
DROP TABLE bill;
