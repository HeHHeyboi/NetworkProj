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
[Captures]
email: jsonpath "$.email"
password: jsonpath "$.password"


POST http://localhost:8080/user/login
[Options]
output: -
{
	"email":"{{ email }}",
	"password":"123"
}
HTTP 201

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cola",
	"menu_type": "Drink",
	"type": "เย็น",
	"price": 15
}
HTTP 201
[Captures]
menu1: jsonpath "$.menu_id"

POST http://localhost:8080/menu
[Options]
output: -
{
	"name": "Cake",
	"menu_type": "Dessert",
	"price": 83 
}
HTTP 201
[Captures]
menu2: jsonpath "$.menu_id"

POST http://localhost:8080/giveAway
[Options]
output:-
{
	"name": "someone",
	"amount": 100,
	"desc": "someone birthday"
}
HTTP 201
[Captures]
giveaway_id: jsonpath "$.id"

POST http://localhost:8080/bill
[Options]
output: -
{
	"orders": [
		{
			"menu_id": {{menu1}},
			"amount": 2
		}
	]
}
HTTP 201
[Captures]
bill1: jsonpath "$.bill_id"

POST http://localhost:8080/bill
[Options]
output: -
{
	"orders": [
		{
			"menu_id": {{menu2}},
			"amount": 3
		}
	],
	"giveaway_id": {{giveaway_id}}
}
HTTP 201
[Captures]
bill2: jsonpath "$.bill_id"

GET http://localhost:8080/bill
[Options]
output: -

GET http://localhost:8080/bill/{{bill1}}
[Options]
output: -

GET http://localhost:8080/bill/{{bill2}}
