GET http://localhost:8080/reset

POST http://localhost:8080/todo
{
	"name":"todo1"
}
HTTP 201

GET http://localhost:8080/todo
[Options]
output: -

PUT http://localhost:8080/todo/1
{
	"name":"todo2"
}

GET http://localhost:8080/todo
[Options]
output: -
