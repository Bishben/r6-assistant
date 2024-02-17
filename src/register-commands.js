require("dotenv").config();

// REGISTERS SLASH COMMANDS

// REST API
const {
  REST,
  Routes,
  Application,
  ApplicationCommandOptionType,
} = require("discord.js");

// SLASH Commands List
const commands = [
  // /hey command
  {
    name: "hey",
    description: "Replies with hey",
  },

  // /ping command
  {
    name: "ping",
    description: "pong",
  },

  // /add command
  {
    name: "add",
    description: "adds two numbers",
    options: [
      {
        name: "first-number",
        description: "give the first number dipshit",
        type: ApplicationCommandOptionType.Number,
        choices: [
          {
            name: "ONE",
            value: 1,
          },
          {
            name: "TWO",
            value: 2,
          },
          {
            name: "THREE",
            value: 3,
          },
        ],
        required: true,
      },

      {
        name: "second-number",
        description: "give the second number dipshit",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },

  // /embed command
  {
    name: "embed",
    description: "so you want a fkn embed huh?",
  },

  // /register-r6-username
  {
    name: "register-r6-username",
    description: "Changes your nickname to your r6-username",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`registering slash commands...`);

    // Saving Commands on API
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(`registered.`);
  } catch (error) {
    console.log(`An Error Occurred: ${error}`);
  }
})();
