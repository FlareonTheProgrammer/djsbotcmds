const { Command } = require("klasa");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "announce",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 30,
      deletable: false,
      bucket: 1,
      aliases: ["annc"],
      guarded: true,
      nsfw: false,
      permissionLevel: 6,
      requiredPermissions: [],
      requiredSettings: [],
      subcommands: false,
      description: "",
      quotedStringSupport: false,
      usage: "<selctedChannel:channel> <anncouncement:announcement>",
      usageDelim: " %% ",
      extendedHelp: "No extended help available.",
    });
  }

  async run(message, [channel, announcement]) {
    channel.send(`**Announcement** from ${message.author.username}#${message.author.discriminator} (\`${message.author.id}\`):
>>> ${announcement}`);
  }
};
