const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: "5432",
  database: "CoWork",
  user: "postgres",
  password: "1234",

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