// index.js/server code
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const { pool, checkConnection } = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("*/styles", express.static(path.join(__dirname, "public/styles")));
app.use("*/scripts", express.static(path.join(__dirname, "public/scripts")));
app.use("*/images", express.static(path.join(__dirname, "public/images")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Registration route
app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  console.log('Received registration request:', { email, password, role });

  // Check the connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password.trim(), 15);
  console.log('Hashed password length:', hashedPassword.length);


  const query = 'INSERT INTO public.users (email, password, role) VALUES ($1, $2, $3) RETURNING user_id';
  const values = [email, hashedPassword, role];

  try {
    const result = await pool.query(query, values);
    const insertedUserId = result.rows[0].user_id;
    console.log('User inserted with ID:', insertedUserId);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error executing registration query', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

// Other routes...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});


