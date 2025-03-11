GET http://localhost:8080/reset
[Options]
output: -

POST http://localhost:8080/user/login
[Options]
output: -
{
	"email":"admin@gmail.com",
	"password":"12345"
}
HTTP 201

POST http://localhost:8080/gallery
[Options]
output: -
{
	"name": "gallery_Name",
	"start_date":"2025-01-25",
	"end_date":"2025-01-30",
	"description":"this is gallery"
}
HTTP 201
[Captures]
name1: jsonpath "$.name"

POST http://localhost:8080/gallery
[Options]
output: -
{
	"name": "thana_gallery",
	"start_date":"2025-03-01",
	"end_date":"2025-03-15",
	"description":"This is thana gallery"
}
HTTP 201
[Captures]
name2: jsonpath "$.name"

GET http://localhost:8080/gallery
[Options]
output: -

DELETE http://localhost:8080/gallery/{{name1}}
DELETE http://localhost:8080/gallery/{{name2}}

GET http://localhost:8080/gallery
