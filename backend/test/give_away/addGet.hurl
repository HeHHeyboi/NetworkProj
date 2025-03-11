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

POST http://localhost:8080/giveAway
[Options]
output:-
{
	"name": "2",
	"amount": 10,
	"desc": "2"
}
HTTP 201

GET http://localhost:8080/giveAway
HTTP 200


