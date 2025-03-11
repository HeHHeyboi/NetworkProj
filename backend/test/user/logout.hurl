GET http://localhost:8080/reset
[Options]
output: -
HTTP 200

POST http://localhost:8080/user
[Options]
output: -
{
	"first_name":"first",
	"last_name":"last",
	"email":"example@gmail.com",
	"password":"123"
}
HTTP 201
[Captures]
email: jsonpath "$.email"

POST http://localhost:8080/user/login
[Options]
output: -
{
	"email":"{{ email }}",
	"password":"123"
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

GET http://localhost:8080/user/logout
[Options]
output: -
HTTP 200

POST http://localhost:8080/gallery
{
	"name": "gallery_Name",
	"start_date":"2025-01-25",
	"end_date":"2025-01-30",
	"description":"this is gallery"
}
HTTP 400
