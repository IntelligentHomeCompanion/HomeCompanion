const express = require("express");
const app = express();
const logger = require("./logger.js");
const discovery = require("./discovery.js");

app.use((req, res, next) => {
  req.start = Date.now();
  next();
});

app.get("/", async (req, res) => {
  // root path handler
  companion.Devices.test();
  res.status(200).json({ message: "Hello World" });
});

// Items under the command slug, need to be reworked to accept raw JSON encoded data.
app.post("/command/text", async (req, res) => {
  let params = {
    data: req.query.data
  };
  
  // now we can take this text data, and pass it to our textParser 
  let command = await companion.Plugins.textParser(params.data);
  // TODO Obviosuly we don't want to just return the text to the user. But this allows the testing 
  // of the plugin loading system.
  res.status(200).json({ message: command });
  logger.httpLog(req, res);
});

app.post("/command/audio", async (req, res) => {
  
});

app.get("/discover", async (req, res) => {
  // This will return quickly, after initializing an async discovery process, to find devices.
  discovery.discover();
  res.status(200).json({ message: "Beginning Discovery" });
});

app.get("/discovered", async (req, res) => {
  // returns the list of discovered devices.
  res.status(200).json(companion.Devices.discovered);
  logger.httpLog(req, res);
});

app.post("/setup", async (req, res) => {
  let body = JSON.parse(req.body);
  
  // this should include the device we want to setup.
  if (body.computer_name) {
    // now we can pass computer name to global Devices
    let out = await companion.Devices.setup(computer_name);
    
    if (!out.ok) {
      // handle errors for it.
      res.status(500).json({ message: out.content });
      logger.httpLog(req, res);
    }
    
    // it went fine. 
    
  } else {
    // invalid json given.
  }
});

app.use((req, res) => {
  // 404 handler 
});

module.exports = app;
