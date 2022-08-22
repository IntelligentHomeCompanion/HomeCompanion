The system is intended to be as extensible as possible.
Supporting a few different generic types of Plugins, each with some expectations about how to interact with them.

All plugins can support a key in the `package.json` of `load` specifying a file to `require` that exports two functions titled `load`, `unload` that can be used for any setup needed.

# Text Parser 

Denoted by `package.json` including:

```json 
providedService: "textParser"
```

Is able to take in text data and turn it into usable commands for the rest of the system.

The `main` key of `package.json` must be sufficient to invoke to be able to handle incoming strings.

The expected usage should follow the example for a `textParser` named `genericTextParser`.

```javascript
const textParser = require("genericTextParser");

let command = await textParser("Turn on the Lights");

// command is now usable for the system.
```

# langaugeParser

Denoted by `package.json` including:

```json 
providedService: "languageParser"
```

Is able to take in audio snippet data and turn it into usage text. This text will then be passed to the textParser.

The `main` key of `package.json` must be sufficient to invoke to be able to handle incoming audio data.

```javascript
const languageParser = require("languageParser");

let text = await langaugeParser('audio.mp3');
```

# deviceIntegrations

# functionalIntegrations
