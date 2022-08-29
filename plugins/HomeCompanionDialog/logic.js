// My first dialog manager 

let nlp = require("./nlp.js");

async function load() {
  companion.utils.log.infoLog("HomeCompanionDialog Modal Up...");
}

async function unload() {
  
}

async function Textual(query) {
  // this is whats actually called when passed text data 
  let NLP = new nlp(query);
  
  // TODO: Clean 
  console.log(`Staring Query: ${query}`);
  await NLP.Tokenize();
  console.log(`Tokens: ${NLP.tokens}`);
  //await NLP.StopWordRemoval();
  //console.log(`Tokens (After SWR): ${NLP.tokens}`);
  await NLP.POS();
  console.log(`Tokens (POS): ${NLP.deepTokens}`);
  console.log(NLP.deepTokens);
  
  await NLP.POSRules();
  console.log(`Tokens (POSRules): `);
  console.log(NLP.deepTokens);
}

module.exports = {
  load,
  unload,
  Textual
};
