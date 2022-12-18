const express = require("express");
const app = express();
const path = require("path");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Listening..... http://%s:%s", host, port);
});
