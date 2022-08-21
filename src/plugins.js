const fs = require("fs");
const path = require("path");
const logger = require("./logger.js");

class Plugins {
  constructor(app) {
    this.app = app;
    this.plugin_list = [];
    
    this.init();
  }
  async init() {
    // call all setup functions 
    await this.findPlugins();
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
            
            this.plugin_list.push({
              path: `./plugins${path.sep}${file}${path.sep}`,
              package: JSON.parse(contents)
            });
            
            logger.debugLog(`Plugin ${contents.name} added to server.`);
            
          }
        }
      }
    } catch(err) {
      logger.warningLog(undefined, undefined, `Failed to Read Plugins: ${err}`);
    }
  }
}

module.exports = Plugins;
