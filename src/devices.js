
class Devices {
  constructor() {
    this.discovered = []; // this is a list of found devices per server run, that have not been added to the system.
  }
  newDevice(computer_name) {
    for (let i = 0; i < this.discovered.length; i++) {
      if (this.discovered[i].computer_name == computer_name) {
        return false;
      }
    }
    return true;
  }
  discoveredIndexOf(computer_name) {
    for (let i = 0; i < this.discovered.length; i++) {
      if (this.discovered[i].computer_name === computer_name) {
        return i;
      }
    }
    return -1;
  }
  async setup(computer_name) {
    let idx = this.discoveredIndexOf(computer_name);
    
    if (idx !=== -1) {
      // the device has a valid IDX, and can be setup 
      // should aslo check that `service_name` existing, or otherwise attempt to create it.
      let canSetup = await companion.Plugins.canSetup(this.discovered[i].service_name);
      
      if (canSetup.setup) {
        let control = await companion.Plugins.startSetup(canSetup.idx);
        
        if (!control.ok) {
          // the setup failed with the supported plugin, return 
          return control;
        } 
        
        // otherwise the setup was successful, lets append the object to the Devices.
        // and remove it from discovered, adding it to setup devices.
      } else {
        return { ok: false, content: `Unable to find plugin to setup ${this.discovered[i].service_name}`, short: "Not Supported" };
      }
    } else {
      // the device could not be found 
      return { ok: false, content: `Could not find ${computer_name} within Discovered Devices.`, short: "Device Not Found" };
    }
  }
  test() {
    console.log('just a test');
  }
}

module.exports = Devices;
