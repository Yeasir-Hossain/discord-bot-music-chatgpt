import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('shuffle').setDescription('Shuffles the queue');
export async function execute({ client, interaction }) {
  const queue = client.player.nodes.get(interaction.guildId);

  if (!queue) return await interaction.editReply('There are no songs in the queue');

  queue.tracks.shuffle();
  await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`);
}