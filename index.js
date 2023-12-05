// index.js/server code
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const userModel = require('./db/models/user');
const { pool, checkConnection } = require('./db'); // Adjust the path accordingly
const session = require("express-session")
const bcrypt = require('bcrypt');
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
  destination: './uploads',  // Adjust the path accordingly
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(
  session({
    secret: "bigboy",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("*/styles", express.static(path.join(__dirname, "public/styles")));
app.use("*/scripts", express.static(path.join(__dirname, "public/scripts")));
app.use("*/images", express.static(path.join(__dirname, "public/images")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.get('/check-login-status', (req, res) => {
  const isLoggedIn = req.session.user ? true : false;
  res.json({ success: true, isLoggedIn });
});


// Registration route
app.post('/register', async (req, res) => {
  const { email, password, role, phone, name } = req.body;
  console.log('Received registration request:', { email, password, role, phone, name });

  // Check the connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  try {
    // Assuming 'createUser' is an asynchronous function in userModel
    const hashedPassword = await bcrypt.hash(password.trim(), 15);
    const result = await userModel.createUser(email, hashedPassword, role, phone, name);

    // Handle the query result
    if (result.length > 0 && 'user_id' in result[0]) {
      const insertedUserId = result[0].user_id;
      console.log('User inserted with ID:', insertedUserId);
      res.json({ success: true, message: 'Registration successful', userId: insertedUserId });
    } else {
      console.error('Unexpected query result:', result);
      throw new Error('Failed to retrieve user ID from the query result');
    }
  } catch (error) {
    console.error('Error handling registration request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

//login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", { email, password });

  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: "Database connection error" });
  }

  try {
    const user = await userModel.getUserByEmail(email);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, set up the session
        req.session.user = {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        // ... (other existing code)

        res.json({
          success: true,
          message: "Login successful",
          userData: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          redirectTo: "/index.html",
        });
      } else {
        // Passwords don't match, login failed
        console.log("Incorrect password. Sending response:", {
          success: false,
          message: "Incorrect password",
        });

        res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      console.log("User not found. Sending response:", {
        success: false,
        message: "User not found",
      });

      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    } else {
      res.json({ success: true, message: "Logout successful" });
    }
  });
});

//upload route for files
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const { filename } = req.body;
    res.json({ success: true, message: 'File uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});


