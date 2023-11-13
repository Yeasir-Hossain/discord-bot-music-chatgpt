/**
 * Transforms the interaction object into a formatted message object.
 *
 * @param {Object} interaction - The original interaction object from Discord.
 * @returns {Object} - A transformed message object for emitting via WebSocket.
 */
export default function transformInteractionToMessage(interaction) {
  const {
    id,
    type,
    channelId,
    content,
    createdTimestamp,
    editedTimestamp = null,
    system,
    author,
    pinned,
    tts,
    embeds,
    components,
    attachments,
    mentions,
  } = interaction;

  const formattedAuthor = {
    id: author.id,
    bot: author.bot,
    system: author.system,
    flags: { bitfield: author.public_flags },
    username: author.username,
    globalName: author.globalName,
    discriminator: author.discriminator,
    avatar: author.avatar,
    banner: author.banner,
    accentColor: author.accentColor,
    avatarDecoration: author.avatarDecoration,
  };

  return {
    id,
    type,
    channel_id: channelId,
    content,
    timestamp: new Date(createdTimestamp).toISOString(),
    ...(editedTimestamp && { edited_timestamp: new Date(editedTimestamp).toISOString() }),
    system,
    author: formattedAuthor,
    pinned,
    tts,
    embeds,
    components,
    attachments,
    mentions: mentions.users,
    mention_everyone: mentions.everyone,
    mention_roles: mentions.roles,
  };
}
