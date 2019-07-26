# delivermoo-api
This api was built by express with mongodb. Deploy on google app engine.

https://delivermoo-247614.appspot.com/

GET /items
GET /item/{id}
GET /orders
GET /order/{id}
POST /orders
POST /items
PATCH /item/{id}
DELETE /item/{id}

Item {
id: string;
type: string;
color: string;
size: "S" | "M" | "L";
stock: number;
}

Order {
id: string;
itemId: string;
quantity: number;
}
