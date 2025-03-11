GET http://localhost:8080/reset
[Options]
output: -

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

POST http://localhost:8080/user/login
[Options]
output: -
{
	"email":"example@gmail.com",
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

POST http://localhost:8080/user
[Options]
output: -
{
	"first_name":"thana",
	"last_name":"that",
	"email":"thana@gmail.com",
	"password":"321"
}
HTTP 201

POST http://localhost:8080/user/login
[Options]
output: -
{
	"email":"thana@gmail.com",
	"password":"321"
}
HTTP 201

POST http://localhost:8080/gallery
[Options]
output: -
{
	"name": "thana_gallery",
	"start_date":"2025-03-01",
	"end_date":"2025-03-15",
	"description":"This is thana gallery"
}
# HTTP 200

GET http://localhost:8080/gallery
[Options]
output: -

GET http://localhost:8080/gallery?month=2025-03
