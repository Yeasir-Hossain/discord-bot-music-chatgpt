import { Player } from 'discord-player';
import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path, { join } from 'path';
import settings from '../settings';
import Guild from './guild';

/**
 * Discord class for handling Discord-related functionalities.
 *
 * @param {string} token - The Discord bot token.
 * @param {string} clientId - The Discord bot client ID.
 * @param {boolean} LOAD_SLASH - Boolean indicating whether to load slash commands.
 */
export default class Discord {
  constructor(token, clientId, LOAD_SLASH, ws) {
    this.settings = settings;
    this.token = token;
    this.clientId = clientId;
    this.LOAD_SLASH = LOAD_SLASH;
    this.ws = ws;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Message]
    });
    this.guild = new Guild(this.settings.GUILD_ID);
  }

  /**
   * Initialize the Discord client, including commands registration, deployment, event handling, and login.
   */
  async init() {
    this.client.player = new Player(this.client);
    await this.client.player.extractors.loadDefault();
    // Commands registering and deploying
    this.client.commands = new Collection();
    const commands = [];

    // Retrieve command folders and files
    const foldersPath = join(path.resolve(), 'src', 'commands');
    const commandFolders = readdirSync(foldersPath);

    // Iterate through command folders and files
    for (const folder of commandFolders) {
      const commandsPath = join(foldersPath, folder);
      const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      // Iterate through command files
      for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);

        // Check for required properties in the command
        if ('data' in command) {
          this.client.commands.set(command.data.name, command);
          if (this.LOAD_SLASH) commands.push(command.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }

    // Load slash commands if specified
    if (this.LOAD_SLASH) {
      const rest = new REST().setToken(this.token);
      rest.put(
        Routes.applicationCommands(this.clientId),
        { body: commands },
      ).then((data) => console.log(`Successfully reloaded ${data.length} application (/) commands.`))
        .catch((e) => console.error(e));
    }

    // Handle events
    const eventsPath = join(path.resolve(), 'src', 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    // Iterate through event files
    for (const file of eventFiles) {
      const filePath = join(eventsPath, file);
      const event = require(filePath);
      // Register events
      if (event.once) {
        this.client.once(event.name, (interaction) => event.execute({ client: this.client, interaction }));
      } else {
        this.client.on(event.name, (interaction) => event.execute({ client: this.client, interaction, ws: this.ws }));
      }
    }

    // Log in
    this.client.login(this.token);
  }
}
