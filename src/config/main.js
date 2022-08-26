const reader = require("./reader.js");

let data = reader.getConfig();

// the object to return with all config options 
let obj;

obj = {
  port: determine(data.PORT, 8080),
  debug: determine(data.DEBUG, false),
  discovery_log: determine(data.DISCOVERY_LOG, false)
};

function determine(opt, def) {
  // used to avoid wearing out my '?' key 
  return opt ? opt : def;
}

module.exports = obj;
