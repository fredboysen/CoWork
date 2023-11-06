//imports
const express = require("express");

const app = express();

app.use(express.static("public"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/scripts", express.static(__dirname + "public/scripts"));
app.use("/images", express.static(__dirname + "public/images"));

//setting views
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index");
});

//listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("App available on http://localhost:3000");
});
