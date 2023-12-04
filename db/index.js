require('dotenv').config();
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true', // You can use SSL if needed
  // Add the following line to specify MD5 authentication
  password_encryption: 'md5',
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

