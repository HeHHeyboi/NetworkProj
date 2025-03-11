-- +goose Up
CREATE TABLE IF NOT EXISTS "order"(
	bill_id TEXT NOT NULL,
	menu_id INTEGER NOT NULL,
	amount INTEGER NOT NULL,
	total_price FLOAT NOT NULL,
	PRIMARY KEY (bill_id,menu_id),
	FOREIGN KEY (bill_id) REFERENCES bill(bill_id) ON DELETE CASCADE,
	FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE SET NULL
);
-- +goose Down
DROP TABLE "order";

