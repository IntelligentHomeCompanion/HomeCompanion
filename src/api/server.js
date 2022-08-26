const main = require("./main.js");

let serve; // The main express instance 

async function load() {
  let port = companion.config.port;
  serve = main.listen(port, () => {
    companion.utils.log.infoLog(`HomeCompanion Server Listening on port ${port}`);
  });
}

async function unload() {
  serve.close(() => {
    console.log("HTTP Server Closed.");
  });
  setImmediate(function(){serve.emit("close")});
  return;
}

function instance() {
  // used to retreive the express instance, to allow extension later on.
  return main;
}

module.exports = {
  load,
  unload,
  instance
};
