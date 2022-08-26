const app = require("./app.js");
const { port } = require("./config.js").getConfig();
const logger = require("./logger.js");
const exterminate = require("./exterminate.js");
const Plugins = require("./plugins.js");
const Devices = require("./devices.js");
const discovery = require("./discovery.js");

// There should likely be a loading of the internal API here, which should 
// attach itself as a global object. (global.)
// Which should allow the devices to be querying globally, as well as maybe even have this 
// emit events? For other plugins to listen to.
// And lastly be a global record of the plugins.
// Also doing this should load all plugins, and load the devices list/configuration.
global.companion = {
  Plugins: new Plugins(app),
  Devices: new Devices()
};

// now with the global API setup, we can start passiveDiscovery 

discovery.passiveDiscover();

const serve = app.listen(port, () => {
  logger.infoLog(`HomeCompanion Server Listening on port ${port}`);
});

process.on("SIGTERM", async () => {
  await exterminate("SIGTERM", serve);
});

process.on("SIGINT", async () => {
  await exterminate("SIGINT", serve);
});
