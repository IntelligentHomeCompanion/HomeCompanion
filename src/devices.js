
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
  test() {
    console.log('just a test');
  }
}

module.exports = Devices;
