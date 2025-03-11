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
[Options]
output:-
HTTP 200
[Captures]
name: jsonpath "$.[0].name"
id: jsonpath "$.[1].id"

GET http://localhost:8080/giveAway?name={{name}}
[Options]
output:-
HTTP 200
[Asserts]
jsonpath "$.name" == {{name}}

GET http://localhost:8080/giveAway?id={{id}}
HTTP 200
[Asserts]
jsonpath "$.id" == {{id}}
