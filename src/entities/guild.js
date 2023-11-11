/**
 * Handler for the API endpoint that retrieves channels from the Discord guild.
 * @param {Object} options - Options object containing necessary properties.
 * @param {Object} options.discord - The Discord instance providing access to guild functionality.
 * @returns -  The channels.
 */
const channels = ({ discord }) => async (req, res) => {
  const channels = await discord.guild.channels();
  res.status(200).send(channels);
};

// Export all handler function
export { channels };
