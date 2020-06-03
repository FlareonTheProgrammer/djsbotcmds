const { Argument } = require("klasa");
const userRegex = /^[0-9]{1,15}$/;
var m;

module.exports = class extends Argument {
  run(arg, possible, message) {
    if (userRegex.test(arg)) {
      return arg;
    }
    throw message.language.get("RESOLVER_INVALID_TTVUSERIDFMT", possible.name);
  }
};
