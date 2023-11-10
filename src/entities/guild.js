
const channels = ({ discord }) => async (req, res) => {
  const channels = await discord.guild.channels();
  res.status(200).send(channels);
};


export { channels };