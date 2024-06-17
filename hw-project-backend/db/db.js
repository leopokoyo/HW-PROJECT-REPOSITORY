const { QueryFile } = require('pg-promise');
const pgp = require('pg-promise')();
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

/* make the connection */
const db = pgp(dbConfig);

module.exports = db;