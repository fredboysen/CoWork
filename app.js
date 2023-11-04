//imports
const { readFile } = require("fs").promises;
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/scripts", express.static(__dirname + "public/scripts"));
app.use("/images", express.static(__dirname + "public/images"));

app.get("/", async (request, response) => {
  response.send(await readFile("views/index.html", "utf8"));
});

//listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("App available on http://localhost:3000");
});
