import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('info').setDescription('Display info about the current song');
export async function execute({ client, interaction }) {
  const queue = client.player.getQueue(interaction.guildId);
  if (!queue) return await interaction.editReply('There are no songs in the queue');
  let bar = queue.createProgressBar({
    queue: false,
    length: 19,
  });
  const song = queue.current;

  await interaction.editReply({
    embeds: [new EmbedBuilder()
      .setThumbnail(song.thumbnail)
      .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)
    ],
  });
}