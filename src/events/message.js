import { Events } from 'discord.js';
/**
 * Event handler for MessageCreate events.
 *
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.interaction - The interaction object.
 * @returns {Promise<void>} - A Promise that resolves when the execution is complete.
 */

export const name = Events.MessageCreate;

export const execute = async ({ interaction }) => {
  // Log guild ID and author's global name
  console.log(interaction.guildId, interaction.author.globalName);

  // The following code is commented out; it seems to be related to chat input commands.
  // Uncomment and modify as needed for handling chat input commands.

  // if (!interaction.isChatInputCommand()) return;

  // const command = interaction.client.commands.get(interaction.commandName);

  // if (!command) {
  //   console.error(`No command matching ${interaction.commandName} was found.`);
  //   return;
  // }

  // try {
  //   await interaction.deferReply();
  //   await command.execute({ client, interaction });
  // } catch (error) {
  //   console.error(`Error executing ${interaction.commandName}`);
  //   console.error(error);
  // }
};
