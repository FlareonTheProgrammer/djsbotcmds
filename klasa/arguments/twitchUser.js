const { Argument } = require("klasa");
const userRegex = /^[a-zA-Z0-9_]{4,25}$/;
var m;

module.exports = class extends Argument {
  run(arg, possible, message) {
    if (userRegex.test(arg)) {
      return arg;
    }
    throw message.language.get("RESOLVER_INVALID_TTVUSERFMT", possible.name);
  }
};
