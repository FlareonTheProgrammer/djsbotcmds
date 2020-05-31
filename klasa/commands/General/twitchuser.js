const { Command } = require("klasa");
const request = require("request-promise-native");
const ttvClient = require("../auth.json").ttvClient;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "twitchuser",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 20,
      deletable: false,
      bucket: 1,
      aliases: ["ttvu", "ttvuser", "ttvui", "twitchui"],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: [],
      requiredSettings: [],
      subcommands: false,
      description: "",
      quotedStringSupport: false,
      usage: "<twitchUser:twitchUser>",
      usageDelim: undefined,
      extendedHelp: "No extended help available.",
    });
  }

  async run(message, [twitchUser]) {
    var ttvAuth = {
      url: "https://id.twitch.tv/oauth2/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      form: {
        client_id: `${ttvClient.id}`,
        client_secret: `${ttvClient.secret}`,
        grant_type: "client_credentials",
      },
      json: true,
    };
    const ttvAuthResp = await request(ttvAuth); // Get OAuth v2 Token to authenticate api requests
    const ttvGetUser = {
      url: `https://api.twitch.tv/helix/users?login=${twitchUser}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${ttvAuthResp.access_token}`,
        "Client-ID": `${ttvClient.id}`,
      },
    };
    const checkForData = (await request(ttvGetUser)).slice(9, -2); // Make sure the user is a real, valid user by seeing if twitch returns any data
    if (checkForData.length == 0) {
      return message.channel.send(
        `While "${twitchUser}" *does* follow Twitch's naming rules, it isn't a valid user.`
      );
    }
    const userData = JSON.parse(checkForData);

    if (userData.broadcaster_type.length == 0) {
      userData.broadcaster_type = "normal user";
    }
    if (userData.description.length == 0) {
      userData.description = "[Broadcaster has empty bio]";
    }
    const infoEmbed = {
      color: 0x9146ff,
      title: "Twitch User Info",
      url: `https://twitch.tv/${userData.login}`,
      thumbnail: {
        url: `${userData.profile_image_url}`,
      },
      fields: [
        {
          name: "User",
          value: `\`${userData.display_name}\``,
          inline: true,
        },
        {
          name: "User ID",
          value: `\`${userData.id}\``,
          inline: true,
        },
        {
          name: "Broadcaster Type",
          value: `\`${
            userData.broadcaster_type.charAt(0).toUpperCase() +
            userData.broadcaster_type.slice(1)
          }\``,
          inline: true,
        },
        {
          name: "Bio",
          value: `\`${userData.description}\``,
        },
        {
          name: "View Count",
          value: `\`${userData.view_count}\``,
        },
      ],
      timestamp: new Date(),
      footer: {
        text: "New Twitch API [Helix]",
        icon_url:
          "https://static-cdn.jtvnw.net/jtv_user_pictures/27bfa19d-e9ab-4d31-bff5-eea89e47a3df-profile_image-300x300.png",
      },
    };
    message.channel.send({ embed: infoEmbed });
  }
};
