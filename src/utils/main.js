// utils is the endpoint to allow many utility functions, throughout the whole application.
const logger = require("./logger.js");

let util = {};

// --- Logging Utils 

util.log = {
  httpLog: logger.httpLog,
  errorLog: logger.errorLog,
  warningLog: logger.warningLog,
  infoLog: logger.infoLog,
  debugLog: logger.debugLog,
  discoveryLog: logger.discoveryLog 
};

module.exports = util;
