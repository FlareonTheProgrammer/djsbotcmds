const {
  discordClient,
  spotifyClient,
  ttvClient,
  ytApi,
} = require("../auth.json");
const { util } = require("klasa");
const zws = String.fromCharCode(8203);
const sensitiveData = [
  discordClient.token,
  spotifyClient.id,
  spotifyClient.secret,
  ttvClient.id,
  ttvClient.secret,
  ytApi.key,
];
var redactRegex = "(";
function makeRegex() {
  sensitiveData.forEach(
    (data) => (redactRegex = redactRegex + `${util.regExpEsc(data)}|`)
  );
  redactRegex = new RegExp(redactRegex.slice(0, -1) + ")", "gi");
}
makeRegex();
exports.redact = function clean(text) {
  return text
    .replace(redactRegex, "「ｒｅｄａｃｔｅｄ」")
    .replace(/`/g, `\`${zws}`)
    .replace(/@/g, `@${zws}`);
};
