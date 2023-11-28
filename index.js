const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set up routes for specific static subdirectories
app.use("/styles", express.static(path.join(__dirname, "public/styles")));
app.use("/scripts", express.static(path.join(__dirname, "public/scripts")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Render the "index.html" file
app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Listen on port 3000 or the provided environment variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});
