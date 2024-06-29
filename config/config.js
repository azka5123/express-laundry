require('dotenv').config(); // this is important!
module.exports = {
"development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_CONNECTION,
    "url": process.env.POSTGRES_URL
},
"test": {
    "username": "process.env.DB_USER",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_CONNECTION,
    "url": process.env.POSTGRES_URL
},
"production": {
    "username": "process.env.DB_USER",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_CONNECTION,
    "url": process.env.POSTGRES_URL
}
};