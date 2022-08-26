
async function exterminate(callee) {
  companion.utils.log.infoLog(`${callee} signal received: shutting down.`);
  // call core modals 
  await companion.services.api.unload();
  
  // call plugin modals
   
  // exit afterwards 
  process.exit(0);
}

module.exports = exterminate;
