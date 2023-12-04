const { Pool } = require("pg");
require('dotenv').config();
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


// Function to check the connection status
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    return false;
  }
};

module.exports = { pool, checkConnection };

