// The main Device Service 

class Device {
  constructor() {
    // discovered is a list of found devices per server run, that have not been added to the system.
    this.discovered = [];
    
    // setup the sub services 
    this.providers = []; // an array of all device providers that the plugin service will load.
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
  
}

module.exports = Device;
