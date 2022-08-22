const fs = require("fs");
const path = require("path");
const logger = require("./logger.js");
const disabled = require("./config.js").getDisabled();

class Plugins {
  constructor(app) {
    this.app = app;
    this.found_plugin_list = [];
    this.loaded_plugin_list = [];
    
    // Loaded plugins will be grouped by the `providedService`
    // Although some services should only have a single provider 
    // which is implied by the lack of plurality in the name 
    this.textParser = undefined;  // The Service that parses text data, and turns it into functional commands 
    this.languageParser = undefined; // Service that takes audio records, and turns it into text 
    this.deviceIntegrations = []; // Services that integrate with different devices 
    this.functionalIntegrations = []; // Services that provide new integrations of features 
    
    this.init();
  }
  async init() {
    // call all setup functions 
    await this.findPlugins();
    await this.loadPlugins();
  }
  async findPlugins() {
    try {
      const files = fs.readdirSync("./plugins");
      
      for await (const file of files) {
        if (fs.lstatSync(`./plugins${path.sep}${file}`).isDirectory()) {
          // we will skip over regular files in this directory, since none should exist.
          
          // now to collect the package.json if it exists
          if (fs.existsSync(`./plugins${path.sep}${file}${path.sep}package.json`)) {
            let contents = fs.readFileSync(`./plugins/${path.sep}${file}${path.sep}package.json`, "utf8");
            
            this.found_plugin_list.push({
              path: `./plugins${path.sep}${file}${path.sep}`,
              package: JSON.parse(contents)
            });
            
            logger.debugLog(`Plugin ${contents.name} added to server.`);
            
          }
        }
      }
      // once everything is processed, return to allow the next async step to occur 
      return;
    } catch(err) {
      logger.errorLog(`Failed to Read Plugins: ${err}`);
    }
  }
  async loadPlugins() {
    for (let i = 0; i < this.found_plugin_list.length; i++) {
      if (!disabled.disabled.includes(this.found_plugin_list[i].package.name)) {
        // the plugin is not on the disabled list, so we can now load it.
        this.loaded_plugin_list.push(this.found_plugin_list[i]);
        
        switch(this.found_plugin_list[i].package.providedService) {
          case "textParser":
            // TODO For services that accept only one provider, may be worthwhile 
            // to check if more than one is being loaded, even if the last read over writes the other 
            let textParser = await this.loadPlugin(this.found_plugin_list[i]);
            this.textParser = textParser;
            break;
          case "langaugeParser":
            let languageParser = await this.loadPlugin(this.found_plugin_list[i]);
            this.languageParser = langaugeParser;
            break;
          case "deviceIntegrations":
            let deviceIntegration = await this.loadPlugin(this.found_plugin_list[i]);
            this.deviceIntegrations.push(deviceIntegration);
            break;
          case "functionalIntegrations":
            let functionalIntegration = await this.loadPlugin(this.found_plugin_list[i]);
            this.functionalIntegrations.push(functionalIntegration);
            break;
        }
      }
    }
  }
  async loadPlugin(plug) {
    let load = require(`.${plug.path}${plug.package.load}`);
    await load.load(); // let the plugin do any setup needed 
    let pack = require(`.${plug.path}${plug.package.main}`); 
    return pack;
  }
}

module.exports = Plugins;
