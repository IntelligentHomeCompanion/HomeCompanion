const express = require("express");
const app = express();

const j_package = require("../../package.json");

app.use((req, res, next) => {
  // setup function before every call 
  req.start = Date.now();
  next();
});

// Now any useful endpoints are intended to be included within API Extensions 
// Here we will only declare system endpoints 

app.get("/system/info", async (req, res) => {
  res.status(200).json(
    {
      "status": "System is up",
      "version": j_package.version,
      "author": j_package.author,
      "license": j_package.license
    }
  );
  // Since middleware is unreliable in reading the statusCode after the 'finish' event, 
  // we will have to put the burden of http logging on the API extension authors.
  companion.utils.log.httpLog(req, res);
});

module.exports = app;
