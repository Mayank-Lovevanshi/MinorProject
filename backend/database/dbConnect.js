require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

module.exports = db;
