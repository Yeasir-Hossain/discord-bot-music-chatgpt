import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('quit').setDescription('Stops the bot and clears the queue');
export async function execute({ client, interaction }) {
  const queue = client.player.nodes.get(interaction.guildId);
  if (!queue) return await interaction.editReply('There are no songs in the queue');

  queue.delete();
  await interaction.editReply('Bye!');
}