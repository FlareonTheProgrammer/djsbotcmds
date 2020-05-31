const { Command } = require("klasa");
const request = require("request-promise-native");
const apiKey = require("../auth.json").ytApi.key;
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "searchyt",
      enabled: true,
      runIn: ["text"],
      cooldown: 60,
      deletable: false,
      bucket: 1,
      aliases: ["syt", "searchyt"],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: [],
      requiredSettings: [],
      subcommands: false,
      description: "",
      quotedStringSupport: false,
      usage: "<query:query>",
      usageDelim: undefined,
      extendedHelp: "No extended help available.",
    });
  }

  async run(message, [query]) {
    var options = {
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&key=${apiKey}`,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      json: true,
    };

    const resp = await request(options);
    const details = resp.items
      .filter(function (value) {
        return value.hasOwnProperty("id");
      })
      .shift()["id"];
    message.channel.send(`https://youtu.be/${details.videoId}`);
  }
};
