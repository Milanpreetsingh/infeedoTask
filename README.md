## About this work
This the backend project is for a Task Manager App. This a [NodeJS]() project built with this helping hands [ExpressJS](), [Sequelize](), [Bcrypt](), [JSONwebtoken](), [Dotenv](), [Body-Parser](), and [Nodemon]() for development.

## Installation
Use [`npm install` comman]() to install the dependencies.
```
$ npm install
```

## Start-Up
```
You can change the enivironment in .env file and you have to add its config in config/default.js file

State-Up the server by running
```
$ npm run start "or" npm run server

## Usage
Below are the methods, route, the user and auth function that performs every action.

Method | Route | Auth
-----------|-----------|-----------|-----------
post | users/register | -
post | users/login | -
post | /tasks/create | auth
get | /tasks/me | auth
patch | /tasks/update/:taskId | auth
get | /tasks/metrics | auth

### Note ### ->>>:
To create the tasks first you have to setup the postgresql (or any other sql for that you have to make change in default.js in dialect) locally or you can setup the remote. For local server you can give the name of database as "postgres".

Then first create the user using register api, then login using the creds then use that token for all the 4 apis for task.

*** Api Doc Link **
https://documenter.getpostman.com/view/23581414/2s9YJaZPta