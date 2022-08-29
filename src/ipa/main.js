// Intelligent Personal Assistant Core Module,
// contains several plugins within 

class IPA {
  constructor() {
    
    // Define varaibles to later be loaded by the plugin service of dependent plugin modals 
    this.speech; // Speech Manager 
    this.dialog; // Dialog Manager 
    this.history; // History Manager 
    this.knowledge; // Knowledge Graph 
    this.provides = []; // Provides Service array of Provides Plugin Modals 
  }
  async consume(data, type) {
    // Initial handoff for data to this service 
    // Expects the raw data as the first aurgument, and the second being the type 
    // Valid Types: 'audio', 'text'
    
    if (type == "audio") {
      console.log("Not yet supported!");
      process.exit(1);
    } else if (type == "text") {
      // since this is text data, we can just worry about passing it to the dialog manager 
      await this.dialog.Textual(data);
    } else {
      console.log("Unknown Type Passed!");
      process.exit(1);
      // TODO: Graceful exit or denail of function here.
    }
  }
  emit() {
    // used once the Dialog Manager has finished acting on the data. Returning an intent to the IPA 
  }
  respond() {
    // used to inform the IPA that an action has been completed
  }
}

module.exports = IPA;
