async function stemmer(word) {
  if (word.endsWith("ing")) {
    return word.substring(0, word.length-3);
  } else if (word.endsWith("ed")) {
    return word.substring(0, word.length-2);
  } else if (word.endsWith("ly")) {
    return word.substring(0, word.length-2);
  } else if (word.endsWith("s")) {
    return word.substring(, word.length-1);
  } else {
    return word;
  }
}

module.exports = stemmer;
