require('dotenv').config();
const mysql = require('mysql2/promise');


console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME); 
console.log('PORT',process.env.PORT)

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  //Limits the connections of this connection pool to 10 connections
  queueLimit: 0
});

module.exports = pool;