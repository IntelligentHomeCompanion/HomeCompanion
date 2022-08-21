const express = require("express");
const app = express();

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

app.get("/", async (req, res) => {
  // root path handler
  companion.Devices.test();
  res.status(200).json({ message: "Hello World" });
});

app.use((req, res) => {
  // 404 handler 
});

module.exports = app;
