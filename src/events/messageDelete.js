import { Events } from 'discord.js';

/**
 * Event handler for MessageDelete events.
 *
 * @param {Object} options - Object containing necessary properties.
 * @param {Object} options.interaction - The interaction object from Discord representing the deleted message.
 * @param {Object} options.ws - WebSocket information.
 * @returns {Promise<void>} - A Promise that resolves when the execution is complete.
 */
export const name = Events.MessageDelete;

/**
 * Emits the ID of the deleted message via WebSocket.
 *
 * @param {Object} interaction - The interaction object representing the deleted message from Discord.
 * @param {Object} ws - The WebSocket instance.
 * @returns {Object} - The interaction object.
 */
export const execute = async ({ interaction, ws }) => {
  try {
    ws.emit('messageDelete', { channelId: interaction.channelId, id: interaction.id });
  } catch (error) {
    console.error(error);
  }
};
