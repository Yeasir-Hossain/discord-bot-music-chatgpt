import { Events } from 'discord.js';
import transformInteractionToMessage from '../utils/transformInteraction';

/**
 * Event handler for MessageCreate events.
 *
 * @param {Object} options - Object containing necessary properties.
 * @param {Object} options.interaction - The interaction object from Discord.
 * @param {Object} options.ws - Web socket information.
 * @returns {Promise<void>} - A Promise that resolves when the execution is complete.
 */
export const name = Events.MessageCreate;

/**
 * Transforms the interaction object into a message object to be emitted via WebSocket.
 *
 * @param {Object} interaction - The original interaction object from Discord.
 * @returns {Object} - A transformed message object for emitting via WebSocket.
 */
export const execute = async ({ interaction, ws }) => {
  try {
    if (interaction.system || !interaction.content) return;
    const message = transformInteractionToMessage(interaction);
    ws.to(message.channel_id).emit('message', message);
  } catch (error) {
    console.error(error);
  }
};