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
}

module.exports = IPA;
