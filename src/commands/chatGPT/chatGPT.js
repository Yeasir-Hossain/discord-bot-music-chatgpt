import { SlashCommandBuilder } from 'discord.js';

/**
 * Slash command data defining the "prompt" command.
 */
export const data = new SlashCommandBuilder()
  .setName('prompt')
  .setDescription('Send a prompt to ChatGPT')
  .addStringOption((option) => option
    .setName('question')
    .setDescription('The question you want to ask')
    .setRequired(true));

/**
 * Executes the "prompt" command, sending the provided question to ChatGPT and responding with the generated prompt.
 *
 * @async
 * @function
 * @param {Object} options - The options for executing the command.
 * @param {Object} options.interaction - The interaction object representing the command interaction.
 * @param {Object} options.gpt - An instance of the ChatGPT service for generating responses.
 * @returns {Promise<void>} A Promise that resolves when the command execution is complete.
 */
export const execute = async ({ interaction, gpt }) => {
  try {
    // Send the provided question to ChatGPT and retrieve the generated response.
    const response = await gpt.prompt(interaction.options.getString('question'));

    // Edit the original interaction reply with the ChatGPT-generated response.
    await interaction.editReply(response);
  } catch (e) {
    console.log(e);
  }
};