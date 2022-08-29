// A key difference in the intended functionality of this 
// While many approches of NLP aim to understand any type of unstructured text 
// since the application here is very straight forward of controlling and inquiring about devices 
// we instead will focus heavily on understanding the command being called for, rather then attempting to understand 
// all language. That means instead of filtering words, and tagging, lemmetizing, and stemming all words 
// we will have a special interest in the use of phrasal verbs.

// Additionally due to the low resources of this modal, we will hope to acheive this through 
// the use of Rule-Based POS Tagging, to find the context of the words.

class NLP {
  constructor(query) {
    
    this.query = query;
    this.tokens = [];
    this.deepTokens = [];
    
    this.stopWords = [ "the", "a"];
    this.dictionary = require("./dictionary.json");
    this.ner = require("./ner.json");
  }
  async Tokenize() {
    // Create each token by splitting at the space.
    let tmpquery = this.query;
    
    // remove punctuation
    tmpquery.replace(".", "").replace("?", "").replace("!", "");
    // tokenize 
    this.tokens = tmpquery.split(" ");
    return;
  }
  async StopWordRemoval() {
    // Depreciated, read top comments
    let rmvIdx = [];
    // Using a for loop here to avoid issues of altering the array while inside it.
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.stopWords.includes(this.tokens[i])) {
        console.log(`SWR: ${this.tokens[i]} Marked`);
        rmvIdx.push(i);
      }
    }
    // now to act on the marked idx locations 
    for (let i = 0; i < rmvIdx.length; i++) {
      this.tokens.splice(rmvIdx[i], 1);
    }
    return;
  }
  async POS() {
    // this will tag each word, giving it an array of possible parts of speech.
    // This function uses 0 context, and uses a dictionary only
    for (let i = 0; i < this.tokens.length; i++) {
      let tok = this.tokens[i].toLowerCase();
      if (this.dictionary[tok]) {
        this.deepTokens.push(this.dictionary[tok]);
      } else {
        // since its current form doesn't exist in our dictionary, lets try and find its stem then check.
        let stem = await this.FindStem(tok);
        if (stem !== undefined && this.dictionary[stem]) {
          // a stem was found, then check in dict 
          this.deepTokens.push(this.dictionary[stem]);
          this.deepTokens[this.deepTokens.length-1].stemmed = tok;
        } else {
          // with no stem, or the stem not in our dict, lets try for the lem.
          let lemme = await this.FindLemme(tok);
          if (lemme !== undefined && this.dictionary[lemme]) {
            this.deepTokens.push(this.dictionary[lemme]);
            this.deepTokens[this.deepTokens.length-1].lemmed = tok;
          } else {
            // no lemme or stem found, check if its a known Named Entity 
            let isner = await this.IsNER(tok);
            if (isner) {
              this.deepTokens.push({ token: tok, pos: [ "noun", "ner" ] });
            } else {
              // nothing found to identify this pos, add as is 
              this.deepTokens.push({ token: tok, pos: [] });
            }
          }
        }
      }
    }
  }
  async POSRules() {
    // this will now take the POS tags, and use rules against it to try and determine each part of the phrase.
    for (let i = 0; i < this.deepTokens.length; i++) {
      if (this.deepTokens[i].pos.includes("preposition") && this.deepTokens[i-1].pos.includes("verb")) {
        // If VERB PREPOSITION => BOTH = Phrasal-Verb
        this.deepTokens[i].rule = "phrasal_verb";
        this.deepTokens[i-1].rule = "phrasal_verb";
      }
      if (this.deepTokens[i].pos.includes("noun") && this.deepTokens[i-1].pos.length > 1 && this.deepTokens[i].pos.includes("determiner")) {
        // If DETERMINER UNKOWN NOUN => UNKOWN = ADJECTIVE 
        this.deepTokens[i-1].pos.push("adjective");
      }
      if (this.deepTokens[i].pos.includes("noun") && this.deepTokens[i-1].pos.includes("determiner")) {
        // If DETERMINER NOUN => BOTH = Phrasal-Noun 
        this.deepTokens[i].rule = "phrasal_noun";
        this.deepTokens[i-1].rule = "phrasal_noun";
      }
    }
  }
  async FindStem(tok) {
    // This stemming method will not rely on a lookup table and instead will just use a Suffix-Stripping Technique 
    if (tok.endsWith("ing")) {
      return tok.substring(0, tok.length-3);
    } else if (tok.endsWith("ed")) {
      return tok.substring(0, tok.length-2)
    } else if (tok.endsWith("ly")) {
      return tok.substring(0, tok.length-2);
    } else if (tok.endsWith("s")) {
      return tok.substring(0, tok.length-1);
    } else {
      return tok;
    }
  }
  async FindLemme(tok) {
    return undefined;
  }
  async IsNER(tok) {
    if (this.ner.includes(tok.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }
  
}

module.exports = NLP;
