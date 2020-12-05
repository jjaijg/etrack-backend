const { createPool } = require('mysql');
const util = require('util');

const pool = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10,
  timezone: 'UTC',
});

const pool1 = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  connectionLimit: 10,
  timezone: process.env.DB_TZ || 'UTC',
});

pool1.query = util.promisify(pool1.query);

module.exports = { pool, pool1 };
