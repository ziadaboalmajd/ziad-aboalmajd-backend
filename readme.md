* using the appliciation 

in the terminal use "npm run start"

then visit http://localhost:3000/ to open the app page

in terminal type "psql -U postgres" to open psql ternimal

then "\c typescriptdatabase" to connect with the server

more details in REQUIREMENTS.md to use the appliciation 

-----------------------------------------------

* Environment variables:

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=first_server
POSTGRES_USER=postgress
POSTGRES_PASSWORD=password
ENV=dev
BCRYPT_PASSWORD=your-secret-password
SALT_ROUNDS=10
MYSQL=jllgshllWEUJHGHYJkjsfjds90
JWT_KEY=secret
JWT_EXPIRE=100

-----------------------------------------------

* Endpoints :

The server will listen on port 3000:
http://localhost:3000/

-----------------------------------------------

Endpoint to signUp new user (  POST/signup  )
http://localhost:3000/signup
method : post

insert data Guide:
{
    "name" : "",
    "email" : "",
    "password" : ""
}

-----------------------------------------------

Endpoint to get all exist user  (  GET /users   )
http://localhost:3000/users

-----------------------------------------------

Endpoint to get user by Id (  GET/users/id:   )
http://localhost:3000/users/:id

url address for example:
http://localhost:3000/users/1

-----------------------------------------------

Endpoint to logIn  (  POST/login   )
http://localhost:3000/login
method : post

insert data Guide :
{
    "name" : "",
    "password" : ""
}

----------------------------------------------

Endpoint to update user Info (  PUT/updateuser   )
http://localhost:3000/updateuser
method : put

insert data Guide :
{
     name: "",
     password: "",
     newName: "",
    newPassword: ""
};

---------------------------------------------

Endpoint to delete exist user (  DELETE/deleteuser   )
http://localhost:3000/deleteuser
method : delelte

insert data Guide :
{
    "name" : "",
    "email" : "",
    "password" : ""
}

SETUP

express
npm i -S express npm i -D @types/express

typescript
npm i -D typescript

db-migrate
npm install -g db-migrate

g
npm install -g n

rimraf
npm install --save rimraf

cors
npm install --save cors

bcrypt
npm -i bcrypt npm -i -D @types/bcrypt

morgan
npm install --save morgan npm -i -D @types/morgan

jsonwebtoken
npm install jsonwebtoken --sav npm -i -D @types/jsonwebtoken

cross-env
npm install --save-dev cross-env

jasmine
npm install jasmine @types/jasmine @ert78gb/jasmine-ts ts-node --save-dev

supertest
npm i supertest npm i --save-dev @types/supertest