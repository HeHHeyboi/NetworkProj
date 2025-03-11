GET http://localhost:8080/reset
[Options]
output: -

POST http://localhost:8080/user?first_name=first&last_name=last&email=example@gmail.com&password=123
HTTP 201

POST http://localhost:8080/user
[Options]
output: -
[FormParams]
first_name: thana
last_name: that
email: thana@gmail.com
password: 321
HTTP 201

GET http://localhost:8080/user
