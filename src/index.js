import Main from './class/main/main';
import { channels } from './entities/guild';
import settings from './settings';
import express from 'express';
const { createServer } = require('node:http');
const { Server } = require('socket.io');
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, { origin: settings.origin });
const discord = new Main();

// CORS middleware
app.use(cors({
  origin: settings.origin,
  credentials: true
}));


const configuration = {
  discord,
  settings,
  ws: io,
};


app.get('/api/channels', channels(configuration));


// socket initialization
io.on('connection', async (socket) => {
  console.log('Connected =>', socket.id);
  socket.on('disconnect', () => console.log('Diconnected =>', socket.id));
});

server.listen(settings.PORT, async () => {
  console.log(`Listening => ${settings.PORT}`);
  try {
    discord.init();
  }
  catch (e) {
    console.log(e);
  }
});