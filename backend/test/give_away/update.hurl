GET http://localhost:8080/reset
[Options]
output:-

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
id: jsonpath "$.id"

POST http://localhost:8080/giveAway
[Options]
output:-
{
	"name": "2",
	"amount": 10,
	"desc": "2"
}
HTTP 201
[Captures]
name: jsonpath "$.name"

GET http://localhost:8080/giveAway
[Options]
output: -
HTTP 200

PUT http://localhost:8080/giveAway/id/1
[Options]
output: -
{
	"name": "somebody",
	"amount": 100,
	"desc": "somebody birthday"
}
HTTP 200

PUT http://localhost:8080/giveAway/name/2
[Options]
output: -
{
	"set_name": "4",
	"amount": 4,
	"desc": "4"
}
HTTP 200

GET http://localhost:8080/giveAway
HTTP 200
