//Imports
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const userModel = require('./db/models/queries');
const { postApplication } = require('./db/models/queries');
const { getJobListings } = require('./db/models/queries');
const { checkConnection } = require('./db');
const session = require("express-session")
const bcrypt = require('bcrypt');
const multer = require("multer");
const app = express();
const storage = multer.diskStorage({ destination: './uploads',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });

//session setup
app.use(
  session({
    secret: "testkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//Body parsing (JSON and URLencoded bodies) and serving static files
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("*/styles", express.static(path.join(__dirname, "public/styles")));
app.use("*/scripts", express.static(path.join(__dirname, "public/scripts")));
app.use("*/images", express.static(path.join(__dirname, "public/images")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//route for checking login status
app.get('/check-login-status', (req, res) => {
  const isLoggedIn = req.session.user ? true : false;
  res.json({ success: true, isLoggedIn });
});


// Registration route
app.post('/register', async (req, res) => {
  const { email, password, role, phone, name } = req.body;
  console.log('Received registration request:', { email, password, role, phone, name });

  // Checks the connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  try {
    //trimming password to ensure no unintended spacing
    const hashedPassword = await bcrypt.hash(password.trim(), 15);
    const result = await userModel.createUser(email, hashedPassword, role, phone, name);

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
        // Passwords match, session start
        req.session.user = {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

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
        // Passwords dont match, login failed
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
  // Destroy the session after logout
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


//job posting route
app.post('/post-application', async (req, res) => {
  const { user } = req.session; 
  const { jobTitle, companyName, location, keySkills, jobDesc, pdfLink } = req.body;
  console.log('Received request body:', req.body);


  if (!user || user.role !== 'employer') {
    return res.status(403).json({ success: false, message: 'Permission denied' });
  }

  // Checking connection status before executing a query
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  try {
    const result = await postApplication(user.userId, jobTitle, companyName, location, keySkills, jobDesc, pdfLink);
    if (result.success) {
      res.json({ success: true, message: 'Job application posted successfully', jobId: result.jobId });
    } else {
      res.status(500).json({ success: false, message: 'Error posting job application' });
    }
  } catch (error) {
    console.error('Error handling job application request:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});


// retrieves job listing from database
app.get('/get-job-listings', async (req, res) => {
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(500).json({ success: false, message: 'Database connection error' });
  }

  try {
    const jobListings = await getJobListings();
    res.json({ success: true, jobListings });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});



//server port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});


