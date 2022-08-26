// Core's responsibilities include starting up all sub services, and beginning device/service discovery.
// This will be done in a specific order, starting with the config, since it is required for many other services 
// to function correctly.

console.log("HomeCompanion Core starting up...");

// Note that when a module is loaded, any modules it requires are imported immediatly 
// this means that if a Core Service requires or sets varaibles dependent on the global API 
// immediatly, it will not be available.
// Core Services MUST check global API config values during run.
const exterminate = require("./exterminate.js");
const config = require("./config/main.js");
const utils = require("./utils/main.js");
const api = require("./api/server.js");
const Device = require("./device/main.js");
const Plugins = require("./plugin/main.js");
const IPA = require("./ipa/main.js");

(async () => {
  global.companion = {};
  companion.services = {};
  
  global.companion.config = config; // this should load the config file globally now 
  console.log("HomeCompanion Config Service UP...");
  
  global.companion.utils = utils; // loads the utils export globally.
  companion.utils.log.infoLog("HomeCompanion Util Service UP...");
  
  global.companion.device = new Device();
  companion.utils.log.infoLog("HomeCompanion Device Service UP...");
  
  global.companion.ipa = new IPA();
  companion.utils.log.infoLog("HomeCompanion IPA Service UP...");
  
  // TODO put discovery service here 
  
  // now to setup the API server 
  await api.load();
  
  global.companion.services.api = api; // setting our imported module under services to allow control from exterminate
  global.companion.api = api.instance(); // setting this to the current express instance, for extensibility later on.
  
  companion.utils.log.infoLog("HomeCompanion API Service UP...");
  
  // TODO put repository service here
  
  global.companion.plugin = new Plugins();
  
  companion.utils.log.infoLog("HomeCompanion Finished Starting up...");
  
})();

process.on("SIGTERM", async () => {
  await exterminate("SIGTERM");
});

process.on("SIGINT", async () => {
  await exterminate("SIGINT");
});

/**
 * Global Object Structure:
 * global.companion 
 *   .services 
 *     .api (API Module)
 *   .utils (Utils Export)
 *   .config (Config Export)
 *   .api (API Export .instance())
*/
