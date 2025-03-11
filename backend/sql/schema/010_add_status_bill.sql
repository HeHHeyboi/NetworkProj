-- +goose Up
-- +gooseStatementBegin
ALTER TABLE bill
ADD COLUMN paid_status BOOLEAN NOT NULL DEFAULT FALSE; 
-- +gooseStatementEnd

-- +goose Down
-- +gooseStatementBegin
ALTER TABLE bill
DROP COLUMN paid_status;
-- +gooseStatementEnd
