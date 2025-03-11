-- +goose Up
ALTER TABLE users
ADD role TEXT DEFAULT 'customer';

-- +goose Down
ALTER TABLE users
DROP COLUMN role;
