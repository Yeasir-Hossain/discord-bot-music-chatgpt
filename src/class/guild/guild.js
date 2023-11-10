import req from '../../utils/req';

export default class Guild {
  constructor(guildId) {
    this.guildId = guildId;
    this.init();
  }

  async init() {
    try {
      const res = await req({ uri: `guilds/${this.guildId}` });
      if (res.code === 10004) throw new Error(res.message);
    }
    catch (e) {
      console.log(e);
    }
  }

  async channels() {
    const channels = await req({ uri: `guilds/${this.guildId}/channels` });
    return channels.filter(channel => channel.type === 0);

  }
}