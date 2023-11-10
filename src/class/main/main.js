import { Player } from 'discord-player';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path, { join } from 'path';
import settings from '../../settings';
import Guild from '../guild/guild';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const LOAD_SLASH = process.argv[2] == 'load';

export default class Main {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ]
    });
    this.guild = new Guild(settings.GUILD_ID);
    this.settings = settings;
  }

  init() {
    this.client.player = new Player(this.client);

    // Commands registering and deploying
    this.client.commands = new Collection();
    const commands = [];

    const foldersPath = join(path.resolve(), 'src', 'commands');
    const commandFolders = readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = join(foldersPath, folder);
      const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command) {
          this.client.commands.set(command.data.name, command);
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
    const eventsPath = join(path.resolve(), 'src', 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        this.client.once(event.name, (interaction) => event.execute({ client: this.client, interaction }));
      } else {
        this.client.on(event.name, (interaction) => event.execute({ client: this.client, interaction }));
      }
    }
    // Log in
    this.client.login(token);
  }
}