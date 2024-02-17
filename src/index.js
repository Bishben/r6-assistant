require("dotenv").config();
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Client(Bot) and IntentsBItField(Access/Permissions) ObjectType from discord.js
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
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

// When Bot goes Online
client.on("ready", (c) => {
  console.log(`${c.user.tag} is online`);
});

// When Message is sent on the Server
client.on("messageCreate", async (message) => {
  // Bot ignores incoming message if sent by a bot
  if (message.author.bot) {
    return;
  }

  // register-r6-username channel
  if (message.channel.id === "1207699586899120170") {
    // deletes text if not '/register-r6-username'
    if (message.content !== "/register-r6-username") {
      message.delete();
    }
  }
});

// When a member interacts with the Bot
client.on("interactionCreate", async (interaction) => {
  const timeStamp = new Date(interaction.createdTimestamp); // getting timestamp of interaction

  if (interaction.isModalSubmit()) {
    console.log(interaction.fields.getTextInputValue("r6Username"));
    interaction.member.setNickname(
      interaction.fields.getTextInputValue("r6Username")
    );
    await interaction.reply({
      content: "Thank you for submitting your r6 username",
      ephemeral: true,
    });
    await wait(5000);
    await interaction.deleteReply();
  }
  // If interaction is '/' command
  if (interaction.isChatInputCommand()) {
    // /register-r6-username
    if (interaction.commandName === "register-r6-username") {
      console.log(`register command called`);
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId("register-modal")
        .setTitle("R6 SIEGE Username Registration");

      // username input
      const usernameInput = new TextInputBuilder()
        .setCustomId("r6Username")
        .setLabel("Please Enter Your R6 Username")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(15)
        .setStyle(TextInputStyle.Short);

      const row = new ActionRowBuilder().addComponents(usernameInput);
      modal.addComponents(row);
      await interaction.showModal(modal);
    }

    // ignores the following /commands if run in r6-register-username
    if (
      interaction.channel.id === "1207699586899120170" &&
      interaction.commandName != "register-r6-username"
    ) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply(
        "This channel is only for registering r6-usernames. Kindly use another channel for all other purposes."
      );
      return;
    }

    if (interaction.commandName === "hey") {
      // /hey command
      interaction.reply(`Hello There!`);
    }

    // /ping command
    if (interaction.commandName === "ping") {
      interaction.reply(`PONG`);
    }

    // /add command
    if (interaction.commandName === "add") {
      const num1 = interaction.options.get("first-number").value;
      const num2 = interaction.options.get("second-number").value;

      const sum = num1 + num2;
      interaction.reply(`The sum is ${sum}`);
    }

    // /embed command
    if (interaction.commandName === "embed") {
      const embed = new EmbedBuilder()
        .setTitle("Obi Wan Kenobi")
        .setDescription("HeLLo tHeRe!")
        .setColor("Random")
        .addFields(
          {
            name: "Anakin Skywalker",
            value: "You were my brother Anakin",
            inline: true,
          },
          {
            name: "Anakin Skywalker",
            value: "You were my brother Anakin",
            inline: true,
          }
        );

      interaction.reply({ embeds: [embed] });
    }
  }

  // If member interacted with a Button (Rank(Role) Changing Button)
  if (interaction.isButton()) {
    await interaction.deferReply({ ephemeral: true }); // ephemeral = only user can see what bot is texting.

    const chosenRole = interaction.guild.roles.cache.get(interaction.customId); // gets custom ID of the role button user clicked on

    const ranksList = [
      // List of available Siege Rank(Corresponding to Role ID)
      "1207325512951660544", // Copper
      "1206967086593744896", // Bronze
      "1206967833490231306", // Silver
      "1206968002914816021", // Gold
      "1207284270037602314", // Platinum
      "1207283977967108188", // Emerald
      "1207284415668031528", // Diamond
      "1207316533169098803", // Champion
    ];

    // Checks if chosenRole still exists
    if (!chosenRole) {
      interaction.editReply({
        content: "Unfortunately the chosen rank/role could not be found :(",
      });
    }

    const memberRolesCache = interaction.member.roles.cache; // gets list of roles of Member

    try {
      for (const [roleId, role] of memberRolesCache) {
        // Case 1: Same Role already Chosen
        if (roleId == chosenRole) {
          await interaction.editReply(
            `Your rank is already ${chosenRole.name}`
          );
          return;
        }

        // Case 2: Switching Roles as Member had one of the other 7 roles
        else if (ranksList.includes(roleId)) {
          await interaction.member.roles.remove(role); // removes current rank
          await interaction.member.roles.add(chosenRole); // adds new rank

          await interaction.editReply(
            `Your rank has been changed successfully to ${chosenRole.name}`
          );

          console.log(
            `Changed -${interaction.member.nickname}'s- rank to ${chosenRole.name}. ${timeStamp}`
          );
          return;
        }
      }

      // Case 3: Member had neither of the 8 ranks
      await interaction.member.roles.add(chosenRole);
      await interaction.editReply(
        `Your rank has been changed successfully to ${chosenRole.name}`
      );
      console.log(
        `Changed -${interaction.member.nickname}'s- rank to ${chosenRole.name}. ${timeStamp}`
      );
    } catch (error) {
      await interaction.editReply(
        `Unfortunately An Error Occurred. Please try again later or contact the admin.`
      );
      console.log(
        `Error: Could not handle Role Change for User '${interaction.member.nickname}':-\n${error}`
      );
    }
  }
});

// Bot Login Token
client.login(process.env.TOKEN);
