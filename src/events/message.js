import { Events } from 'discord.js';

export const name = Events.MessageCreate;
export async function execute({ interaction }) {
  // https://discord.com/api/channels/1168117414257492099

  // 1168117414257492099
  console.log(interaction.guildId, interaction.author.globalName);
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
}