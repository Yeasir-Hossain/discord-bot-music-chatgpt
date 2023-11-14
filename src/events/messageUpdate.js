import { Events } from 'discord.js';
import transformInteractionToMessage from '../utils/transformInteraction';

/**
 * Event handler for MessageUpdate events.
 *
 * @param {Object} options - Object containing necessary properties.
 * @param {Object} options.interaction - The interaction object from Discord representing the updated message.
 * @param {Object} options.ws - WebSocket information.
 * @returns {Promise<void>} - A Promise that resolves when the execution is complete.
 */
export const name = Events.MessageUpdate;

/**
 * Transforms the updated interaction object into a message object for WebSocket emission.
 *
 * @param {Object} interaction - The updated interaction object from Discord.
 * @param {Object} ws - The socket intance.
 * @returns {Object} - A transformed message object for emitting via WebSocket.
 */
export const execute = async ({ interaction, ws }) => {
  try {
    if (interaction.system || interaction.author.bot) return;
    const message = transformInteractionToMessage(interaction.reactions.message);
    ws.to(message.channel_id).emit('messageUpdate', message);
  } catch (error) {
    console.error(error);
  }
};
