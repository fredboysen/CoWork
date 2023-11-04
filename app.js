const { readFile } = require("fs").promises;
const express = require("express");
const path = require("path");

const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  response.send(await readFile("views/index.html", "utf8"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App available on http://localhost:3000");
});
