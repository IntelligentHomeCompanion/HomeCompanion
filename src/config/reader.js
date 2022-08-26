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
  
  // after its loaded, lets return the raw yaml object for further parsing.
  return data;
}

module.exports = {
  getConfig,
};
