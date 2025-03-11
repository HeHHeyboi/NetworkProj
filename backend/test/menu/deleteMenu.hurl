GET http://localhost:8080/reset

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cola",
	"type": "Drink",
	"price":25 
}
HTTP 200

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cake",
	"type": "Dessert",
	"price": 105 
}
HTTP 200

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Whip Cream",
	"type": "Options",
	"price": 15 
}
HTTP 200

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Coffee",
	"type": "Drink",
	"price": 85 
}
HTTP 200

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cookie",
	"type": "Snack",
	"price": 50 
}
HTTP 200

GET http://localhost:8080/menu
[Options]
output: -
HTTP 200

DELETE http://localhost:8080/menu/name/Cake
[Options]
output: -
HTTP 204

GET http://localhost:8080/menu
[Options]
output: -
HTTP 200

DELETE http://localhost:8080/menu/id/3
[Options]
output: -
HTTP 204

GET http://localhost:8080/menu
[Options]
output: -
HTTP 200

DELETE http://localhost:8080/menu/name/something
HTTP 204

DELETE http://localhost:8080/menu/id/99
HTTP 204
