-- +goose Up
ALTER TABLE "order"
ADD COLUMN menu_name TEXT NOT NULL;

-- +goose Down
ALTER TABLE "order"
DROP COLUMN menu_name;
