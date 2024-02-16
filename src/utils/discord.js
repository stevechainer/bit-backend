require("dotenv").config();

const createDiscordInvite = async () => {
  try {
    const channelId = "1207984358997229651";
    const botToken = process.env.DISCORD_BOT_TOKEN;

    console.log(`Bot ${botToken}`);
    const apiUrl = `https://discord.com/api/v10/channels/${channelId}/invites`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${botToken}`,
      },
      body: JSON.stringify({
        max_age: 86400, // Invite link expiration time in seconds (optional)
        max_uses: 1, // Maximum number of uses for the invite (optional)
      }),
    });

    const result = await response.json();

    if (response.ok) {
      const inviteLink = `https://discord.gg/${result.code}`;
      return inviteLink;
    } else {
      console.error("Error creating Discord invite link:", result.message);
      return null;
    }
  } catch (error) {
    console.error("Error getting Discord invite code:", error.message);
    return null;
  }
};

module.exports = { createDiscordInvite };
