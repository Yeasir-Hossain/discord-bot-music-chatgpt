require('dotenv').config();
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const LOAD_SLASH = process.argv[2] == "load"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Commands registering and deploying
client.commands = new Collection();
const commands = []

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
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
        .catch((e) => console.error(e))
}


// handle events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in 
client.login(token);