async function exterminate(callee, serve) {
  console.log(`${callee} signal received: shutting down.`);
  // call any first party shutdowns
  // call any plugin shutdowns 
  console.log("Exiting...");
  serve.close(() => {
    console.log("HTTP Server Closed.");
    process.exit(0);
  });
  setImmediate(function(){serve.emit('close')});
}

module.exports = exterminate;
