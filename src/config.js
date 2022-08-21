const fs = require("fs");
const yaml = require("js-yaml");

function getConfig() {
  let data;
  try {
    let fileContent = fs.readFileSync("./app.yaml", "utf8");
    data = yaml.load(fileContent);
  } catch(err) {
    console.log(`Failed to load app.yaml! ${err}`);
    process.exit(1);
  }
  
  // after its loaded we can return our nice object with defaults 
  return {
    port: data.PORT ? data.PORT : 8080
  };
}

module.exports = {
  getConfig,
};
