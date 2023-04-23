* API Endpoints 

users
    - Index : 'users/' [GET] (token)
    - Show : 'users/:id' [GET] (token)
    - Create : 'signup/' [POST] (token)
    - login : 'login/' [POST] (token)
    - update : 'updateuser' [PUT] (token)
    - Delete : 'deleteuser' [DELETE] (token)

orders
    - Index : 'orders/' [GET] 
    - Show : 'orders/:id' [GET] 
    - Create : 'orders/' [POST] 
    - addProducts : 'orders/:id/products' [POST]

products
    - Index : 'products/' [GET] (token)
    - Show : 'products/:id' [GET] (token)
    - Create : 'products/' [POST] (token)


DATA SHAPE TABLE

- users
id
name
email
password
token

TABLE users ( id:SERIAL PRIMARY KEY ,name:TEXT , email:TEXT ,password:TEXT , token:TEXT );

- orders
id
status
user_id

TABLE orders (id SERIAL PRIMARY KEY ,status VARCHAR(64), user_id bigint REFERENCES users(id));

- products
id
name 
price

TABLE products (id SERIAL PRIMARY KEY ,name VARCHAR(64) NOT NULL, price integer NOT NULL);

TABLE order_products (id SERIAL PRIMARY KEY ,quantity integer, order_id bigint REFERENCES orders(id),product_id  bigint REFERENCES products(id));

* port number db 

port number 5432

**************************************************
* Setup db and server instructions: 

1) first step db setup

in ternimal run "psql -U postgres"

then run :

CREATE DATABASE typescriptdatabase;

\l

\c typescriptdatabase;

2) second step server setup

in the terminal use "npm run start"

then visit http://localhost:3000/ to open the app page

*****************************************************

* Database schema with column name and type