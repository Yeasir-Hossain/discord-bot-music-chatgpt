import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('skip').setDescription('Skips the current song');
export async function execute({ client, interaction }) {
  const queue = client.player.nodes.get(interaction.guildId);

  if (!queue) return await interaction.editReply('There are no songs in the queue');

  const currentSong = queue.currentTrack;
  // skip the current song
  queue.node.skip();
  await interaction.editReply({
    embeds: [
      new EmbedBuilder().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
    ]
  });
}