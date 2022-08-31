const tokenize = require("./tokenize.js");
const stemmer = require("./stemmer.js");

async function load() {
  companion.utils.log.infoLog("HomeCompanionNLP-LG Modal Up...");
}

async function unload() {
  
}

async function parse(query) {
  
}

module.exports = {
  load, 
  unload,
  parse
};
