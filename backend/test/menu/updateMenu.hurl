GET http://localhost:8080/reset

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cola",
	"type": "Drink",
	"price": 15
}
HTTP 200

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cake",
	"type": "Dessert",
	"price": 83 
}
HTTP 200

GET http://localhost:8080/menu
[Options]
output: -
HTTP 200
[Captures]
id: jsonpath "$.[0].menu_id"
name: jsonpath "$.[1].name"

PUT http://localhost:8080/menu/id/{{id}}
{
	"name": "Cola",
	"type": "Meal",
	"price": 55 
}

PUT http://localhost:8080/menu/name/{{name}}
{
	"name": "Red Velvet",
	"type": "Dessert",
	"price": 100 
}

GET http://localhost:8080/menu
[Options]
output: -
HTTP 200

PUT http://localhost:8080/menu/name/something
[Options]
output: -
{
	"name": "Red Velvet",
	"type": "Dessert",
	"price": 100 
}

PUT http://localhost:8080/menu/id/99
[Options]
output: -
{
	"name": "Cola",
	"type": "Meal",
	"price": 55 
}

GET http://localhost:8080/menu
HTTP 200
