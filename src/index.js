// Import external modules
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
dotenv.config();

// Internal imports
import settings from './settings';
import Discord from './class/discord';
import { channels, messages } from './entities/guild';

// Load environment variables
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const chatgpt_api_key = process.env.CHAT_GPT_API_KEY;
const LOAD_SLASH = process.argv[2] && process.argv[2].toLowerCase() == 'load';

// Create Express app
const app = express();
app.use(express.json());
app.use(cors({
  origin: settings.origin,
  credentials: true
}));

const server = createServer(app);
const ws = new Server(server, {
  cors: {
    origin: settings.origin,
    methods: ['GET', 'POST']
  }
});
const discord = new Discord(token, clientId, LOAD_SLASH, ws, chatgpt_api_key);

// Configuration object
const configuration = {
  discord,
  settings,
  ws
};

// API routes
app.get('/api/channels', channels(configuration));
app.get('/api/messages/:channelId', messages(configuration));

// Socket initialization
ws.on('connection', async (socket) => {
  console.log('Connected =>', socket.id);
  socket.on('disconnect', () => console.log('Disconnected =>', socket.id));
});

// Server listening
server.listen(settings.PORT, async () => {
  console.log(`Listening => ${settings.PORT}`);
  try {
    discord.init();
  } catch (e) {
    console.log(e);
  }
});
