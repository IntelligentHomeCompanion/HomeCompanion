const fs = require("fs");
const path = require("path");

class Plugins {
  constructor() {
    this.found_plugin_list = [];
    this.loaded_plugin_list = [];
    
    // Loaded plugins will be grouped by the `provdes`
    // Although some services should only have a single provider 
    // which is implied by the lack of plurality in the name 
    
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
          // this will skip over regular files in this directory, since none should exist.
          
          // now to collect the manifest file.
          if (fs.existsSync(`./plugins${path.sep}${file}${path.sep}manifest.json`)) {
            let contents = fs.readFileSync(`./plugins${path.sep}${file}${path.sep}manifest.json`, "utf8");
            
            this.found_plugin_list.push({
              path: `./plugins${path.sep}${file}${path.sep}`,
              package: JSON.parse(contents)
            });
            
            companion.utils.log.debugLog(`Plugin ${contents.name} added to the server.`);
            
          } else {
            companion.utils.log.warningLog(`Plugin ${file} has no manifest.json file!`);
          }
        }
      }
    } catch(err) {
      companion.utils.log.errorLog(`Failed to read Plugins: ${err}`);
    }
  }
  
}

module.exports = Plugins;
