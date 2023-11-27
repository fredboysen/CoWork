//database connection code:
const path = require("path");
require("dotenv").config({
  override: true,
  path: path.join(__dirname, "development.env"),
});
const { Pool, Client} = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env_DATABASE,
    password: process.env_PASSWORD,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  });
  
  // Listen for the 'connect' event
  pool.on('connect', () => {
    console.log('Connected to the database');
  });
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Current date and time from the database:", result.rows[0].now);
  }

  // Close the pool (optional, as the pool will be closed when the application exits)
  pool.end();
});

