require("dotenv").config();

// ObjectType from discord.js
const {
  Client, // =Bot
  GatewayIntentBits, // Access / Permissions
  EmbedBuilder, // Creates Embed Structures
  ActionRowBuilder, // Creates Rows
  ButtonBuilder, // Creates Button
  ButtonStyle, // Creates Button Styles
  TextInputBuilder, // Creates Button Styles
  TextInputStyle,
} = require("discord.js");

// Client = Bot
const client = new Client({
  // Access / Permissions
  intents: [
    GatewayIntentBits.Guilds, // Guild = Discord Server
    GatewayIntentBits.GuildMembers, // Server Members
    GatewayIntentBits.GuildMessages, // Server Write Text
    GatewayIntentBits.MessageContent, // Server Read Text
  ],
});

const roles = [
  {
    id: "1207325512951660544",
    label: "Copper",
  },
  {
    id: "1206967086593744896",
    label: "Bronze",
  },
  {
    id: "1206967833490231306",
    label: "Silver",
  },
  {
    id: "1206968002914816021",
    label: "Gold",
  },
  {
    id: "1207284270037602314",
    label: "Platinum",
  },
  {
    id: "1207283977967108188",
    label: "Emerald",
  },
  {
    id: "1207284415668031528",
    label: "Diamond",
  },
  {
    id: "1207316533169098803",
    label: "Champion",
  },
];

// Bot Sends a Role Choosing Message
client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get("1207699586899120170"); // gets chanel which you want to send a message to

    // If channel not found it will throw an error and stop the program
    if (!channel) {
      console.log(`Error 404: Channel Not Found`);
      return;
    }

    // Building 2 rows using ActionRowBuilder()
    const row1 = new ActionRowBuilder();
    const row2 = new ActionRowBuilder();

    // First 5 ranks (One row only holds 5 buttons)
    roles.slice(0, 5).forEach((role) => {
      // Creating and Pushing Buttons into the Row
      row1.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Secondary)
      );
    });

    // Second Row with the rest 3 Ranks
    roles.slice(-3).forEach((role) => {
      // Creating and Pushing Buttons into the Row
      row2.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Secondary)
      );
    });

    const nicknameInput = new TextInputBuilder()
      .setCustomId("r6username")
      .setLabel("r6.username")
      .setStyle(TextInputStyle.Short);

    row2.addComponents(nicknameInput);

    // Sending the message to the Channel
    await channel.send({
      content: "Select your Rank Below.",
      components: [row1, row2],
    });

    process.exit();
  } catch (error) {
    console.log(`An Error Occurred: ${error}`);
  }
});

// Bot Login
client.login(process.env.TOKEN);
