import { Events } from 'discord.js';
/**
 * Event handler for InteractionCreate events.
 *
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.client - The Discord client instance.
 * @param {Object} options.interaction - The interaction object.
 * @returns {Promise<void>} - A Promise that resolves when the execution is complete.
 */
export const name = Events.InteractionCreate;
export const execute = async ({ client, interaction }) => {
  // Check if the interaction is a chat input command
  if (!interaction.isChatInputCommand()) return;

  // Get the command based on the interaction's command name
  const command = interaction.client.commands.get(interaction.commandName);

  // Check if the command exists
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    // Defer the reply before executing the command
    console.log(interaction);
    await interaction.deferReply();

    // Execute the command
    await command.execute({ client, interaction });
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
};
