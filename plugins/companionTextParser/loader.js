async function load() {
  console.log("companionTextParser is loaded.");
  return;
}

async function unload() {
  console.log("companionTextParser is unloaded");
  return;
}

module.exports = {
  load,
  unload,
};
