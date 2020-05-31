const { Argument } = require("klasa");

module.exports = class extends Argument {
  run(arg, possible, message) {
    if (arg.length < 1600) {
      return arg;
    }
    throw message.language.get(
      "RESOLVER_MINMAX_MAX",
      possible.name,
      1600,
      "characters"
    );
  }
};
