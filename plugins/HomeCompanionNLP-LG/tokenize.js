async function tokenize(query) {
  let tmpquery = this.query;
  // remove punctionation.
  tmpquery.replace(".", "").replace("?", "").replace("!", "");
  return tmpquery.split(" ");
}

module.exports = tokenize;
