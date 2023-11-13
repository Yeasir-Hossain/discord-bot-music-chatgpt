/**
 * Handler for the API endpoint that retrieves channels from the Discord guild.
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.discord - The Discord instance providing access to guild functionality.
 * @returns -  The channels.
 */
export const channels = ({ discord }) => async (req, res) => {
  const channels = await discord.guild.channels();
  res.status(200).send(channels);
};

/**
 * Handler for the API endpoint that retrieves channels from the Discord guild.
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.discord - The Discord instance providing access to guild functionality.
 * @returns -  The channels.
 */
export const messages = ({ discord }) => async (req, res) => {
  const messages = await discord.guild.messages(req.params.channelId, req.query);
  res.status(200).send(messages);
};