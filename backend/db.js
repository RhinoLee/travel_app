const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();
const connectionString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

pool = new Pool({
  connectionString
})

module.exports = pool;

