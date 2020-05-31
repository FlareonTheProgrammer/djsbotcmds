const { Argument } = require("klasa");

module.exports = class extends Argument {
  run(arg, possible, message) {
    return encodeURIComponent(arg);
  }
};
