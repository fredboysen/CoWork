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
  const { email, password, role, phone, name } = req.body;
  console.log('Received registration request:', { email, password, role, phone, name });

  // Check the connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password.trim(), 15);
  

const query = 'INSERT INTO public.users (email, password, role, phone, name) VALUES ($1, $2, $3, $4, $5) RETURNING user_id';
const values = [email, hashedPassword, role, phone, name];


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

// Inside your /login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password });

  // Check the connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  const query = 'SELECT * FROM public.users WHERE email = $1';
  const values = [email];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, login successful
        console.log('Login successful. Sending response:', {
          success: true,
          message: 'Login successful',
          userData: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: '/index.html',
        });

        res.json({
          success: true,
          message: 'Login successful',
          userData: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: '/index.html',
        });
      } else {
        // Passwords don't match, login failed
        console.log('Incorrect password. Sending response:', {
          success: false,
          message: 'Incorrect password',
        });

        res.json({ success: false, message: 'Incorrect password' });
      }
    } else {
      // No user found with the provided email
      console.log('User not found. Sending response:', {
        success: false,
        message: 'User not found',
      });

      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error executing login query', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});


