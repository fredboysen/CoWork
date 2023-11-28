const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: "5432",
  database: "postgres",
  user: "postgres",
  password: "1234",
});

client.connect();

client.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");

    // Run a simple query to test the connection
    client.query("SELECT NOW()", (queryErr, result) => {
      if (queryErr) {
        console.error("Error executing query:", queryErr.message);
      } else {
        console.log(
          "Current date and time from the database:",
          result.rows[0].now
        );
      }

    
      client.end();
    });
  }
});


