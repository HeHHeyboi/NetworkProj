-- +goose Up
-- +gooseStatementBegin
ALTER TABLE menu
RENAME COLUMN type to menu_type;

ALTER TABLE menu
ADD COLUMN type TEXT;
-- +gooseStatementEnd



-- +goose Down
-- +gooseStatementBegin
ALTER TABLE menu
DROP COLUMN type;

ALTER TABLE menu
RENAME COLUMN menu_type to type;
-- +gooseStatementEnd
