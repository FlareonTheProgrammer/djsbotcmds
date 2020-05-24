const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
const os = require("os");
exports.run = async (client, message) => {
  if (os.hostname() === client.config.stableDeployHost) {
    await message.channel.send(
      "Hostname confirmed. Fetching data from repository..."
    );
    const { exec } = require("child_process");
    exec("git fetch && git pull", async (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      } else {
        async function hasteFunc(output) {
          if (output.length > 1000) {
            const haste = await hastebin(output, { extension: "txt" });
            return `Output too long to send in discord message. See ${haste} for full details.`;
          } else {
            return output;
          }
        }
        msgToSend = await hasteFunc(stdout);
        message.channel.send(`**Output:**\n\`\`\`\n${msgToSend}\n\`\`\``);
        console.log(`stderr: ${stderr}`);
        if (!Boolean(stdout.includes("Already up to date."))) {
          message.reply(
            "Files have been updated, would you like to reboot the bot?"
          );
          const collector = new Discord.MessageCollector(
            message.channel,
            (m) => m.author.id === message.author.id,
            { time: 10000 }
          );
          console.log(collector);
          collector.on("collect", async (message) => {
            if (message.content.toLowerCase() == "no") {
              message.channel.send(
                "Alright, just remember to reboot the bot to apply changes."
              );
            } else if (message.content.toLowerCase() == "yes") {
              await message.reply("I am rebooting now.");
              await Promise.all(
                client.commands.map((cmd) => client.unloadCommand(cmd))
              );
              process.exit(0);
            }
          });
        }
      }
    });
  } else {
    return message.channel.send(
      "**ERROR**: ```Bot is not currently running on the designated stable release host.\n" +
        "Run git fetch/pull yourself, stop being lazy. \n" +
        `Expected: "${client.config.stableDeployHost}"\n` +
        `Found: "${os.hostname}" instead.\n\`\`\``
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["gitpull", "update"],
  permLevel: "Bot Admin",
};

exports.help = {
  name: "gitfetch",
  category: "System",
  description: "fetches and pulls git repo updates",
  usage: "gitfetch",
};
