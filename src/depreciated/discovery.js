const mdns = require("multicast-dns")();
const logger = require("./logger.js");

async function discover() {
  // This will be a common function, that attempts to discover as many devices as possible, then add 
  // them to the global companion.Devices.discovered array.
  // It should contain several methods to do so, to attempt finding every single endpoint possible.
  
  // this function will be called to force discovery, as its called via an endpoint.
  // and will do so by sending out its own query 
  mdns.query({
    questions: [{
      name: '.local', // hopefully .local can query anything on the domain.
      type: 'A'
    }]
  });
  logger.discoveryLog("MDNS Query Sent...");
}

async function passiveDiscover() {
  // this is called during server startup, and silently listens to all mdns traffic, 
  // hopefully finding any services during generic broadcast or responses to 
  // other devices.
  mdns.on("response", function(response) {
    logger.discoveryLog("MDNS Response Received...");
    // this is a device responding to an MDNS query, so we will want to save it as a discovered service.
    processDiscovery(response);
  });
  mdns.on("query", function(query) {
    logger.discoveryLog("MDNS Query Recieved...");
    // we will likely want to store queries in some way, but for now will be ignored, to add devices.
  });
}

function processDiscovery(res) {
  // this will take in an mdns response from `multicast-dns` and parse it according to its record type.
  // attempting to find a unique ID for it, to add as the `id` in the discovered, to avoid duplicate discovery 
  let obj = {
    SRV: {},
    PTR: {},
    TXT: {},
    A: {},
    AAAA: {}
  };
  
  // the goal here to to scan over the values looking for the data we care about.
  // * ttl 
  // * id (unique way to refer to this specific device)
  // * name (something to refer to it by)
  // * ip_address
  
  // ------- Definitions -------
  /**
  * device._service._proto.domain : full_name
  * E.G.
  * Google-Cast-Group-MAC._googlecast._tcp.local 
  *
  * COMPUTER_NAME.local : computer_name
  * E.G.
  * 2a0bede1-00f3-8456-88fc-4af83a6a8169.local 
  */
  
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
  
  for (let i = 0; i < res.answers.length; i++) {
    onType(res.answers[i]);
  }
  for (let i = 0; i < res.additionals.length; i++) {
    onType(res.additionals[i]);
  }
  
  buildServiceObject(obj);
  
}

function buildServiceObject(obj) {
  logger.discoveryLog(`MDNS Response Prettified: ${obj}`);
  // this expects to be handed a clean object from processDiscovery
  
  const onlyUnique = function(value, index, self) {
    return self.indexOf(value) === index;
  };
  
  // First we will build arrays of all the duplicate values that may or may not exist 
  // While creating each array, we will filter any falsy values, https://stackoverflow.com/a/28607462/12707685
  let computer_name_array = [ obj.SRV.computer_name, obj.A.computer_name, obj.AAAA.computer_name ].filter(Boolean).filter(onlyUnique);
  let service_name_array = [ obj.PTR.service_name ].filter(Boolean).filter(onlyUnique);
  let full_name_array = [ obj.SRV.full_name, obj.PTR.full_name, obj.TXT.full_name ].filter(Boolean).filter(onlyUnique);
  let ttl_array = [ obj.SRV.ttl, obj.PTR.ttl, obj.TXT.ttl, obj.A.ttl, obj.AAAA.ttl ].filter(Boolean);
  let ip_array = [ obj.A.ip ].filter(Boolean).filter(onlyUnique);
  let port_array = [ obj.SRV.port ].filter(Boolean).filter(onlyUnique);
  let mac_array = [ obj.AAAA.mac ].filter(Boolean).filter(onlyUnique);
  
  // now to create an object to return, without any collisions,
  let return_obj = {};
  
  if (computer_name_array.length === 1) {
    return_obj.computer_name = computer_name_array[0];
  } // the array is longer than 1
  if (service_name_array.length === 1) {
    return_obj.service_name = service_name_array[0];
  } // to long 
  if (full_name_array.length === 1) {
    return_obj.full_name = full_name_array[0];
  }
  if (ttl_array.length === 1) {
    return_obj.ttl = ttl_array[0];
  } else {
    // ttl array is longer than one, lets get the shortest value 
    return_obj.ttl = Math.min(ttl_array); // TODO returns null
  }
  if (ip_array.length === 1) {
    return_obj.ip = ip_array[0];
  }
  if (port_array.length === 1) {
    return_obj.port = port_array[0];
  }
  if (mac_array.length === 1) {
    return_obj.mac = mac_array[0];
  }
  
  // there should be proper solutions to collision detection here.
  
  // now to ensure that device hasn't already been added 
  if (companion.Devices.newDevice(return_obj.computer_name)) {
    // this is a new device 
    companion.Devices.discovered.push(return_obj);
  }
}

async function endDiscover() {
  mdns.destroy();
}

module.exports = {
  discover,
  passiveDiscover,
  endDiscover,
};
