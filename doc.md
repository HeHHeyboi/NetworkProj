# API Documentation
[/reset Endpoint](#get-reset)

[/checkAuth Endpoint](#get-checkauth)

[/user Endpoint](#user)

- [GET /user: แสดง Account ทั้งหมด](#get-user)

- [GET /user/:id แสดงข้อมูลของ user](#get-userid)

- [POST /user: สร้าง Account](#post-user)

- [POST /user/login: user ล็อกอิน เข้า Account](#post-userlogin)

- [GET /user/logout: ลบ user cookie](#get-userlogout)

- [GET /user/bill: แสดงข้อมูล bill ของ user ทั้งหมด](#get-userbill)

- [GET /user/bill/{id}: แสดงข้อมูล bill ของ user ที่มี id นี้](#get-userbillid)

[/gallery Endpoint](#gallery)

- [POST /gallery : จอง Gallery](#post-gallery)

- [GET /gallery?month : แสดง Gallery ที่ได้จองทั้งหมด](#get-gallerymonth)

[/menu Endpoint](#menu)
- [GET /menu : List menu ทั้งหมด](#get-menu)

- [POST /menu : เพิ่มเมนู](#post-menu)

- [PUT /menu : แก้ไขข้อมูลใน เมนู](#put-menu)

- [DELETE /menu : ลบเมนู](#delete-menu)

[/giveAway Endpoint](#giveaway)
- [GET /giveAway : List giveaway ทั้งหมด](#get-giveaway)
  
- [POST /giveAway : เพิ่ม giveAway](#post-giveaway)

[/bill Endpoint](#bill)
- [GET /bill : List bill ทั้งหมด](#get-bill)

- [GET /bill/{id} : ดูบิลด้วย id](#get-billid)

- [POST /bill : เพิ่ม bill](#post-bill)

- [DELETE /bill/{id} : ลบบิล](#delete-billid) 

## [GET /reset](#get-reset)
Reset ข้อมูลใน Data Base
```
http://localhost:8080/reset
```

## [GET /checkAuth](#get-checkauth)
เอาไว้เช็คว่า login หรือยัง

# [/user](#user)

## [GET /user](#get-user)
จะได้ค่าออกมาเป็น Array ของ json ที่มีโครงสร้างดังนี้

`GET http://localhost:8080/user`

Example:
```
[
    {
        "id": "000-0000-000", 
        "first_name": "ธนทัต",   
        "last_name": "บุญยานันท์",
        "email": "example@gmail.com",
        "password": "Hash Password"
    },
// 
]
```
- `id`: UUID ของ user
- `first_name`: ชื่อ
- `last_name`: นามสกุล
- `email`: อีเมลของ user
- `password`: จะได้ค่าเป็นรหัสผ่านที่ถูกเข้ารหัส

## [GET /user/:id](#get-userid)
แสดงข้อมูลของ `user` ที่มี id นี้จะได้
```
{
	"id": "000-0000-000", 
	"first_name": "ธนทัต",   
	"last_name": "บุญยานันท์",
	"email": "example@gmail.com",
},
```
- `id`: UUID ของ user
- `first_name`: ชื่อ
- `last_name`: นามสกุล
- `email`: อีเมลของ user

## [POST /user](#post-user)
- Content-Type: application/json
ในการสร้าง User account ต้องการ data ที่ส่งมาพร้อมกับ Request คือ
Data ที่ต้องส่งมาคือ
Example:

`POST http://localhost:8080/user`
```
{
    "first_name": "ธนทัต",  
    "last_name": "บุญยานันท์",
    "email": "example@gmail.com",
    "password": "123456"
}
```
จากนั้นจะส่ง json กลับมา
```
{
    "id": "000-0000-000", 
    "first_name": "ธนทัต",   
    "last_name": "บุญยานันท์",
    "email": "example@gmail.com",
    "password": "Hash Password"
}
```
- `id`: UUID ของ user
- `first_name`: ชื่อ
- `last_name`: นามสกุล
- `email`: อีเมลของ user
- `password`: จะได้ค่าเป็นรหัสผ่านที่ถูกเข้ารหัส

## [POST /user/login](#post-userlogin)
Login เข้าบัญชีด้วย `email` & `password` จะทำการสร้าง cookie ในเครื่องของ client
Example:

`POST http://localhost:8080/user/login`
```
{
    "email": "example@gmail.com",
    "password": "123456"
}
```
จากนั้นจะสร้างคุกกี้และส่ง `HTTP 201` หมายความว่า Login สำเร็จ ถ้านอกเหนือจากนั้นอาจจะเป็น
- รหัสผิด
- ไม่ได้สร้าง Account

## [GET /user/logout](#post-userlogin)

`GET http://localhost:8080/user/logout`

ทำการลบคุกกี้ login ออก

## [GET /user/bill](#get-userbill)
List bill ของ user นี้ทั้งหมดจะได้
```
[
	{
		"bill_id": "e88a1fa2ec9bf245",
		"total": 500.00,
		"pay_date": "2025-03-01T00:00:00Z",
		"user_id": "c3eb881-1510-4f4d-8759-dc8ee5f87d72",
		"giveaway_id": 1,
		"orders : [
			{
				"menu_id": 1,
				"amount": 2,
				"total_price": 100
			},
			...
		]
	}
]
```
- `bill_id`: หมายเลขบิล
- `total`:  ยอดรวม
- `pay_date`: วันที่สร้าง bill
- `user_id`: id ของ user
- `giveaway_id`: giveaway id
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
 	- `amount`: จำนวนเมนูที่สั่ง
  	- `total_price`: amount * menu.price

## [GET /user/bill/{id}](#get-userbillid)
แสดงข้อมูล bill ของ user นี้ที่มี id นี้ (user ต้อง login และต้องมี `id` cookies)
จะได้
```
{
	"bill_id": "e88a1fa2ec9bf245",
	"total": 500.00,
	"pay_date": "2025-03-01T00:00:00Z",
	"user_id": "c3eb881-1510-4f4d-8759-dc8ee5f87d72",
	"giveaway_id": 1,
	"orders : [
		{
			"menu_id": 1,
			"amount": 2,
			"total_price": 100
		},
		...
	]
}
```
- `bill_id`: หมายเลขบิล
- `total`:  ยอดรวม
- `pay_date`: วันที่สร้าง bill
- `user_id`: id ของ user
- `giveaway_id`: giveaway id
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
 	- `amount`: จำนวนเมนูที่สั่ง
  	- `total_price`: amount * menu.price	

# [/gallery](#gallery)

## [POST /gallery](#post-gallery)

`POST http://localhost:8080/gallery`

จองวันที่จัด Gallery
Data ที่ต้องส่งมาคือ
```
{
    "name": "gallery_Name",
    "start_date": "2025-01-25",
    "end_date": "2025-01-30",
    "description": "This is a gallery",
}
```
- `name`: ชื่อของแกลลอรี่
- `start_date`: วันที่จองแกลลอรี่
- `end_date`: วันที่สิ้นสุดแกลลอรี่
- `description`: คำอธิบาย
- `user_id(FK)`: ID ของ User

## [GET /gallery?month=](#get-gallerymonth)

`POST http://localhost:8080/gallery?month=..`

จะได้ค่าออกมาเป็น Array ของ json ที่มีโครงสร้างดังนี้
Query:
- `month`: this(แสดง Gallery ที่มี `start_date` ภายในเดือนนี้)

Example:
```
[
    {
        "name": "gallery_Name",
        "start_date": "2025-01-25",
        "end_date": "2025-01-30",
        "description": "This is a gallery",
        "user_id": "9f75a8e2-36a2-4e1c-9e76-ecfda7cfb4a6"
    }
]
```
- `name`: ชื่อของแกลลอรี่
- `start_date`: วันที่จองแกลลอรี่
- `end_date`: วันที่สิ้นสุดแกลลอรี่
- `description`: คำอธิบาย
- `user_id(FK)`: ID ของ User

## [DELETE /gallery/{name}](#delete-galleryname)
`name`: ชื่อของแกลลอรี่
เอาไว้ใช้ลบ gallery
```
http://localhost:8080/gallery/some_name
```
`Status 204`

# [/menu](#menu)

## [GET /menu](#get-menu)

`GET http://localhost:8080/menu`

List เมนู จะได้ออกมาเป็น
```
[
    {
		"name":  "กาแฟ",
		"menu_type": "เครือ่งดื่ม",
		"type": "ร้อน",
		"price": 85.00
		"img_url": [/upload/ชื่อไฟล์, ...]
	},
    ...
]
```
- `name` : ชื่อของเมนู
- `menu_type` : ประเภทของเมนู
- `type` : ร้อน,เย็น
- `price` : ราคาของเมนู
- `img_url`:  List ของ url รูปภาพ

แบบนี้จะได้ขเมนูทั้งหมดถ้าอยากได้
อีกแบบนึงคือ

`GET http://localhost:8080/menu/id/{menu_id}`
`GET http://localhost:8080/menu/name/{name}`

- `menu_id` : id ของเมนู
- `name` : ชื่อของเมนู
จะได้
```
{
	"name":  "กาแฟ",
	"menu_type": "เครือ่งดื่ม",
	"type": "ร้อน",
	"price": 85.00
	"img_url": [/upload/ชื่อไฟล์, ...]
},
```
## [POST /menu](#post-menu)
ใช้ในการเพิ่มเมนูใหม่ลง Data Base
Example:

`POST http://localhost:8080/menu`
```
{
	"name":  "กาแฟ",
	"menu_type": "เครือ่งดื่ม",
	"type": "ร้อน",
	"price": 85.00
},
```
จากนั้นจะส่งข้อมูลทั้งหมดของเมนู กลับมา
```
{
	"menu_id": 1
	"name":  "กาแฟ",
	"menu_type": "เครือ่งดื่ม",
	"type": "ร้อน",
	"price": 85.00
	"img_url": "/upload/ชื่อไฟล์"
},
```
- `menu_id`: id ของเมนู
- `name` : ชื่อของเมนู
- `menu_type` : ประเภทของเมนู
- `type` : ร้อน,เย็น
- `price` : ราคาของเมนู
- `img_url` : url ไปที่ไฟล์รูปภาพ


## [PUT /menu](#put-menu)
แก้ไขข้อมูลเมนูมี 2 แบบ (ยังไม่ได้ทำสำหรับ upload รูปภาพ)

`PUT http://localhost:8080/menu/id/{menu_id}`
`PUT http://localhost:8080/menu/name/{name}`

- `menu_id` : id ของเมนู
- `name` : ชื่อของเมนู
ข้อมูลที่ต้องส่งมาเพื่อที่จะแก้ไขข้อมูลคือ
```
{
	"name":  "กาแฟ",
	"menu_type": "เครือ่งดื่ม",
	"type": "ร้อน",
	"price": 85.00
},
```
ปล. ต้องส่งมาทุกอัน แม้บางอันจะไม่ได้แก้ไขก็ต้องส่งมา

## [DELETE /menu](#delete-menu)
ลบข้อมูลเมนูมี 2 แบบ

`DELETE http://localhost:8080/menu/id/{menu_id}`
`DELETE http://localhost:8080/menu/name/{name}`

# [/giveAway](#giveaway)

## [GET /giveAway](#get-giveaway)
ใช้ในการ List รายการ GiveAway
`Query Parameter`
- `id` : id ของ GiveAway
- `name` : ชื่อของ GiveAway
Ex.
```
http://localhost:8080/giveAway?id=1
http://localhost:8080/giveAway?name=สักชื่อ
```
จะได้
```
[
  {
    "id": 1,
    "name": "someone",
    "amount": 100,
    "remain": 100,
    "desc": "someone birthday",
    "date": "2025-03-01T00:00:00Z",
	"img_url" : ["/upload/ชื่อไฟล์",...]
  },
...
]
```
- `id` : id ของ GiveAway
- `name` : ชื่อของ GiveAway
- `amount` : จำนวนของ GiveAway ทั้งหมด
- `remain` : จำนวนยอดคงเหลือของ GiveAway
- `desc` : คำอธิบาย
- `date` : วันที่เพิ่ม GiveAway เข้ามา
- `img_url` : List ของ url ไปที่ไฟล์รูปภาพ

## [POST /giveAway](#post-giveaway)
ใช้สำหรับเพิ่ม GiveAway ใหม่
ข้อมูลที่ต้องส่งมาคือ
```
{
	"name": "someone",
	"amount": 100,
	"desc": "someone birthday"
}
```
- `name` : ชื่อของ GiveAway
- `amount` : จำนวนของ GiveAway ทั้งหมด
- `desc` : คำอธิบาย
จะได้
```
{
    "id": 1,
    "name": "someone",
    "amount": 100,
    "remain": 100,
    "desc": "someone birthday",
    "date": "2025-03-01T00:00:00Z",
	"img_url" : ["/upload/ชื่อไฟล์",...]
},
```
- `id` : id ของ GiveAway
- `name` : ชื่อของ GiveAway
- `amount` : จำนวนของ GiveAway ทั้งหมด
- `remain` : จำนวนยอดคงเหลือของ GiveAway
- `desc` : คำอธิบาย
- `date` : วันที่เพิ่ม GiveAway เข้ามา
- `img_url` : List ของ url ไปที่ไฟล์รูปภาพ

# [/bill](#bill)

## [GET /bill](#get-bill)
ใช้สำหรับ List Bill ทั้งหมด จะได้
```
[
	{
		"bill_id": "e88a1fa2ec9bf245",
		"total": 500.00,
		"pay_date": "2025-03-01T00:00:00Z",
		"user_id": "c3eb881-1510-4f4d-8759-dc8ee5f87d72",
		"giveaway_id": 1,
		"orders : [
			{
				"menu_id": 1,
				"menu_name": น้ำส้ม,
				"amount": 2,
				"total_price": 100
			},
			...
		]
	}
]
```
- `bill_id`: หมายเลขบิล
- `total`:  ยอดรวม
- `pay_date`: วันที่สร้าง bill
- `user_id`: id ของ user
- `giveaway_id`: giveaway id
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
    - `menu_name`: ชื่อเมนู	
 	- `amount`: จำนวนเมนูที่สั่ง
  	- `total_price`: amount * menu.price	

## [GET /bill/{id}](get-billid)
เอาข้อมูลบิลจาก id จะได้
```
{
	"bill_id": "e88a1fa2ec9bf245",
	"total": 500.00,
	"pay_date": "2025-03-01T00:00:00Z",
	"user_id": "c3eb881-1510-4f4d-8759-dc8ee5f87d72",
	"giveaway_id": 1,
	"orders : [
		{
			"menu_id": 1,
			"menu_name": น้ำส้ม,
			"amount": 2,
			"total_price": 100
		},
		...
	]
}
```
- `bill_id`: หมายเลขบิล
- `total`:  ยอดรวม
- `pay_date`: วันที่สร้าง bill
- `user_id`: id ของ user
- `giveaway_id`: giveaway id
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
    - `menu_name`: ชื่อเมนู	
 	- `amount`: จำนวนเมนูที่สั่ง
  	- `total_price`: amount * menu.price	

## [POST /bill](#post-bill)
ใช่สำหรับสร้าง bill โดยข้อมูลที่ต้องส่งมาคือ
```
{
	"orders": [
		{
			"menu_id": 1,
			"amount": 2
		},
	"giveaway_id": 1,
		...		
	]
}
```
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
 	- `amount`: จำนวนเมนูที่สั่ง
- `giveaway_id`: id ของ giveaway อาจจะมีหรือไม่มีก็ได้
จากนั้นจะส่งข้อมูลนี้กลับมา
```
{
	"bill_id": "e88a1fa2ec9bf245",
	"total": 500.00,
	"pay_date": "2025-03-01T00:00:00Z",
	"user_id": "c3eb881-1510-4f4d-8759-dc8ee5f87d72",
	"giveaway_id": 1,
	"orders : [
		{
			"menu_id": 1,
			"menu_name": น้ำส้ม,
			"amount": 2,
			"total_price": 100
		},
		...
	]
}
```
- `bill_id`: หมายเลขบิล
- `total`:  ยอดรวม
- `pay_date`: วันที่สร้าง bill
- `user_id`: id ของ user
- `giveaway_id`: giveaway id
- `orders`: List ของ order
	- `menu_id`: id ของเมนู
	- `menu_name`: ชื่อเมนู	
 	- `amount`: จำนวนเมนูที่สั่ง
  	- `total_price`: amount * menu.price	

## [DELETE /bill/{id}](delete-billid)
`id`: หมายเลขบิล
เอาไว้ลบบิล
```
http://localhost:8080/bill/3ebb38dd7370f5f2
```
`Status 204`

