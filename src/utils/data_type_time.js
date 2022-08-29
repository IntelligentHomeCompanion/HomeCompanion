// Contains the functions needed for the _time_ data type accessible through intent declarations.

class Time {
  constructor(value, modifier) {
    // the arguments are intended for easy use with the intent syntax.
    // The value being @when/VALUE:MODIFIER 
    // Where the modifier declares what form the value is in.
    this.value = value;
    this.mod = modifier;
    this.currentMilli = performance.now(); // this collects the current time in milli of type initialization.
    // Supported modifier values:
    // epochMilli - milliseconds since epoch 
    // min - in minutes 
    // hour - in hours 
  }
  getSecond() {
    switch (this.mod) {
      case "epochMilli":
        return this.value/1000;
        break;
      case "min":
        return this.value * 60;
        break;
      case "hour":
        return this.value * 3600;
        break;
    }
  }
}
