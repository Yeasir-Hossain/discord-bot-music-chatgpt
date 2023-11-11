import { Events } from 'discord.js';
/**
 * Event handler for ClientReady events.
 *
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.client - The Discord client instance.
 * @returns {void} - The function does not return a value.
 */
export const name = Events.ClientReady;
export const once = true;
export const execute = ({ client }) => {
  // Log the client's tag when logged in
  console.log(`Logged in => ${client.user.tag}`);
};


