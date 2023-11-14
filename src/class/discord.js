import { Player } from 'discord-player';
import { Client, Collection, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import path, { join } from 'path';
import settings from '../settings';
import Guild from './guild';
import ChatGPT from './chatGPT';

/**
 * Discord class for handling Discord-related functionalities.
 *
 * @class Discord
 * @param {string} token - The Discord bot token.
 * @param {string} clientId - The Discord bot client ID.
 * @param {boolean} LOAD_SLASH - Boolean indicating whether to load slash commands.
 * @param {WebSocket} ws - The WebSocket connection.
 * @param {string} chatgpt_api_key - The API key for the ChatGPT service.
 */
export default class Discord {
  /**
   * @constructor
   * @param {string} token - The Discord bot token.
   * @param {string} clientId - The Discord bot client ID.
   * @param {boolean} LOAD_SLASH - Boolean indicating whether to load slash commands.
   * @param {WebSocket} ws - The WebSocket connection.
   * @param {string} chatgpt_api_key - The API key for the ChatGPT service.
   */
  constructor(token, clientId, LOAD_SLASH, ws, chatgpt_api_key) {
    /**
     * The settings object containing various configurations.
     * @member {Object}
     */
    this.settings = settings;

    /**
     * The Discord bot token.
     * @member {string}
     */
    this.token = token;

    /**
     * The Discord bot client ID.
     * @member {string}
     */
    this.clientId = clientId;

    /**
     * Boolean indicating whether to load slash commands.
     * @member {boolean}
     */
    this.LOAD_SLASH = LOAD_SLASH;

    /**
     * The WebSocket connection.
     * @member {WebSocket}
     */
    this.ws = ws;

    /**
     * Instance of the ChatGPT class for GPT-based interactions.
     * @member {ChatGPT}
     */
    this.gpt = new ChatGPT(chatgpt_api_key);

    /**
     * The Discord.js Client instance.
     * @member {Client}
     */
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

    /**
     * Instance of the Guild class for handling guild-specific operations.
     * @member {Guild}
     */
    this.guild = new Guild(this.settings.GUILD_ID);
  }

  /**
   * Initialize the Discord client, including commands registration, deployment, event handling, and login.
   *
   * @async
   * @method init
   */
  async init() {
    /**
     * Discord.js Player instance for handling audio playback.
     * @member {Player}
     */
    this.client.player = new Player(this.client, {
      ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
      }
    });

    // Load default audio extractors
    await this.client.player.extractors.loadDefault();

    /**
     * Collection of registered commands.
     * @member {Collection}
     */
    this.client.commands = new Collection();

    /**
     * Array containing command data for slash command registration.
     * @member {Array<Object>}
     */
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

      /**
       * Iterate through the event files and register the events
       * The execute funtion is the execution of the event
       * After the event is executed then the execution of the commands are executed inside the event
       */
      const executeFunction = (interaction) => event.execute({ client: this.client, interaction, ws: this.ws, gpt: this.gpt });
      this.client[event.once ? 'once' : 'on'](event.name, executeFunction);
    }

    // Log in
    this.client.login(this.token);
  }
}
