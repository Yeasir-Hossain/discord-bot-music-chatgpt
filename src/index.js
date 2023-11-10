const dotenv = require('dotenv');
import { Player } from 'discord-player';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
dotenv.config();
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const LOAD_SLASH = process.argv[2] == 'load';
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});
client.player = new Player(client);

// Commands registering and deploying
client.commands = new Collection();
const commands = [];

const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command) {
      console.log(`Command: ${command.data.name} registered!`);
      client.commands.set(command.data.name, command);
      if (LOAD_SLASH) commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

if (LOAD_SLASH) {
  const rest = new REST().setToken(token);
  rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  ).then((data) => console.log(`Successfully reloaded ${data.length} application (/) commands.`))
    .catch((e) => console.error(e));
}


// handle events
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (interaction) => event.execute({ client, interaction }));
  }
}

// Log in
client.login(token);