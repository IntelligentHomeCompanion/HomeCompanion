const mdns = require("multicast-dns")();

class MDNS {
  constructor() {
    // this will setup passive discovery services 
    mdns.on("response", function(response) {
      companion.utils.log.discoveryLog("MDNS Response Received...");
      // now to process it as a discovered service 
      this.processDiscovery(response);
    });
    mdns.on("query", function(query) {
      companion.utils.log.discoveryLog("MDNS Query Received...");
      // We will likely want to store and process these in some way. But for now, 
      // we will just log.
    });
  }
  search() {
    // will send out a generic mdns query to then capture responses 
    mdns.query({
      questions: [{
        name: ".local",
        type: "A"
      }]
    });
    companion.utils.log.discoveryLog("MDNS Query Sent...");
  }
  processDiscovery(res) {
    // Will take a response and parse it according to its record type.
    // The goal then is to collect all information about a specific item, 
    // to avoid duplicate discovery and hope that any service that supports setting 
    // it up then has enough data to do so.
    let obj = {
      SRV: {},
      PTR: {},
      TXT: {},
      A: {},
      AAAA: {}
    };
    
    const onType = function(record) {
      switch(record.type) {
        case "SRV": 
          obj.SRV = {
            full_name: record.name,
            ttl: record.ttl,
            port: record.data.port,
            computer_name: record.data.target
          };
          break;
        case "PTR":
          obj.PTR = {
            service_name: record.name,
            ttl: record.ttl,
            full_name: record.data 
          };
          break;
        case "TXT": 
          obj.TXT = {
            full_name: record.name,
            ttl: record.ttl,
            data: record.data 
          };
          break;
        case "A": 
          obj.A = {
            computer_name: record.name,
            ttl: record.ttl,
            ip: record.data 
          };
          break;
        case "AAAA":
          obj.AAAA = {
            computer_name: record.name,
            ttl: record.ttl,
            mac: record.data 
          };
          break;
        // NSEC is currently being ignored, as this implementation is not as involved during mdns actions.
      }
    };
    
    const onlyUnique = function(value, index, self) {
      return self.indexOf(value) === index;
    };
    
    const buildServiceObject(obj) {
      // First we will build arrays of all the duplicate values that may or may not exist 
      // While creating each array, we will filter any falsy values, https://stackoverflow.com/a/28607462/12707685
      let computer_name_array = [ obj.SRV.computer_name, obj.A.computer_name, obj.AAAA.computer_name ].filter(Boolean).filter(onlyUnique);
      let service_name_array = [ obj.PTR.service_name ].filter(Boolean).filter(onlyUnique);
      let full_name_array = [ obj.SRV.full_name, obj.PTR.full_name, obj.TXT.full_name ].filter(Boolean).filter(onlyUnique);
      let ttl_array = [ obj.SRV.ttl, obj.PTR.ttl, obj.TXT.ttl, obj.A.ttl, obj.AAAA.ttl ].filter(Boolean);
      let ip_array = [ obj.A.ip ].filter(Boolean).filter(onlyUnique);
      let port_array = [ obj.SRV.port ].filter(Boolean).filter(onlyUnique);
      let mac_array = [ obj.AAAA.mac ].filter(Boolean).filter(onlyUnique);
      
      let return_obj = {};
      
      if (computer_name_array.length === 1) {
        return_obj.computer_name = computer_name_array[0];
      } // longer 
      if (service_name_array.length === 1) {
        return_obj.service_name = service_name_array[0];
      } // longer 
      if (full_name_array.length === 1) {
        return_obj.full_name = full_name_array[0];
      } // longer 
      if (ttl_array.length === 1) {
        return_obj.ttl = ttl_array[0];
      } else {
        // ttl is longer than one, lets find the sortest value 
        return_obj.ttl = Math.min(ttl_array); // TODO returns null 
      }
      if (ip_array.length === 1) {
        return_obj.ip = ip_array[0];
      } // longer 
      if (port_array.length === 1) {
        return_obj.port = port_array[0];
      }
      if (mac_array.length === 1) {
        return_obj.mac = mac_array[0];
      }
      
      return return_obj;
    };
    
    for (let i = 0; i < res.answers.length; i++) {
      onType(res.answers[i]);
    }
    for (let i = 0; i < res.additionals.length; i++) {
      onType(res.additionals[i]);
    }
    let finishObj = buildServiceObject(obj);
    
    // TODO now to prevent duplicates, and add to list.
  }
  endDiscover() {
    mdns.destroy();
  }
  
}

module.exports = {
  MDNS 
};
