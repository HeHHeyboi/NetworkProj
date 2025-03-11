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

POST http://localhost:8080/bill
[Options]
output: -
HTTP 201
[Captures]
bill1: jsonpath "$.bill_id"

POST http://localhost:8080/bill
[Options]
output: -
HTTP 201
[Captures]
bill2: jsonpath "$.bill_id"

GET http://localhost:8080/bill
[Options]
output: -

DELETE http://localhost:8080/bill/{{bill1}}
[Options]
output: -

GET http://localhost:8080/bill
[Options]
output: -

DELETE http://localhost:8080/bill/{{bill2}}
[Options]
output: -

GET http://localhost:8080/bill
