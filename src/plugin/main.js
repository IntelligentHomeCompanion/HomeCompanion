const fs = require("fs");
const path = require("path");

class Plugins {
  constructor() {
    this.found_plugin_list = [];
    this.loaded_plugin_list = [];
    
    // this should be properly filled in 
    this.plugin_status_list = {
      disabled: [],
      enabled: []
    };
    
    // Loaded plugins will be grouped by the `provdes`
    // Although some services should only have a single provider 
    this.api_ext = [];
    this.device_provider = [];
    this.function_provider = [];
    this.util = [];
    this.speech = undefined;
    this.dialog = undefined;
    this.history = undefined;
    this.knowledge = undefined;
    
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
  async loadPlugins() {
    for (let i = 0; i < this.found_plugin_list.length; i++) {
      if (!this.plugin_status_list.disabled.includes(this.found_plugin_list[i].package.name)) {
        // the plugin is not the disabled list, so we can load it.
        this.loaded_plugin_list.push(this.found_plugin_list[i]);
        
        switch(this.found_plugin_list[i].package.provides) {
          case "api":
            // API Extension Plugin Modal 
            this.api_ext.push( await this.loadPlugin(this.found_plugin_list[i]));
            break;
          case "device_provider":
            // Device Object Compatibility Plugin Modal 
            this.device_provider.push( await this.loadPlugin(this.found_plugin_list[i]));
            break;
          case "function_provider":
            // Functionality Plugin Modal 
            this.function_provider.push( await this.loadPlugin(this.found_plugin_list[i]));
            break;
          case "speech":
            // Speech Manager Plugin Modal 
            if (this.speech === undefined) {
              this.speech = await this.loadPlugin(this.found_plugin_list[i]);
              // then to assign our new instance to the IPA service 
              companion.ipa.speech = this.speech;
            } else {
              // an item has already been assigned as the speech plugin.
              // TODO: Hook this into a notification system 
              companion.utils.log.debugLog(`${this.found_plugin_list[i].package.name} attempted to redeclare Existing Speech Manager Plugin.`);
            }
            break;
          case "dialog":
            // Dialog Manager Plugin Modal 
            if (this.dialog === undefined) {
              this.dialog = await this.loadPlugin(this.found_plugin_list[i]);
              // assign to ipa 
              companion.ipa.dialog = this.dialog;
            } else {
              // TODO: Hook into notification system.
              companion.utils.log.debugLog(`${this.found_plugin_list[i].package.name} attempted to redeclare Existing Dialog Manager Plugin.`);
            }
            break;
          case "history":
            // History Manager Plugin Modal 
            if (this.history === undefined) {
              this.history = await this.loadPlugin(this.found_plugin_list[i]);
              // assign to ipa 
              companion.ipa.history = this.history;
            } else {
              // TODO: Hook into notification system.
              companion.utils.log.debugLog(`${this.found_plugin_list[i].package.name} attempted to redeclare Exisitng History Manager Plugin.`);
            }
            break;
          case "knowledge":
            // Knowledge Graph Plugin Modal 
            if (this.knowledge === undefined) {
              this.knowledge = await this.loadPlugin(this.found_plugin_list[i]);
              // assign to ipa 
              companion.api.knowledge = this.knowledge;
            } else {
              // TODO: Hook into notification system.
              companion.utils.log.debugLog(`${this.found_plugin_list[i].package.name} attempted to redeclare Existing Knowledge Graph Plugin.`);
            }
            break;
        }
      }
    }
  }
  async loadPlugin(plug) {
    let item = require(`../.${plug.path}${plug.package.main}`);
    if (typeof item.load === "function") {
      await item.load(); // let the plugin do any setup needed.
    }
    return item;
  }
  async destroy() {
    // this will then go through every type of plugin and unload it if possible 
    if (this.api_ext.length > 0) {
      for (let i = 0; i < this.api_ext.length; i++) {
        await this.unloadPlug(this.api_ext[i]);
      }
    }
  }
  async unloadPlug(plug) {
    if (plug !== undefined && typeof plug.unload === "function") {
      await plug.unload(); // let it do any shutdown it needs.
    }
    return;
  }
  
}

module.exports = Plugins;
