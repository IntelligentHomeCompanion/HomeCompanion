async function load() {
  // Create some variables that reference to the global functions for simplicity 
  let app = companion.api;
  let log = companion.utils.log.httpLog;
  
  app.get("/query/text", async (req, res) => {
    let params = {
      data: req.query.data
    };
    
    // first to call the IPA with this data 
    await companion.ipa.consume(params.data, "text");
    
  });
  
  companion.utils.log.infoLog("primaryAPI UP!");
}

module.exports = {
  load
};
