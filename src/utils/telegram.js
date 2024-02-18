require("dotenv").config();
const { Telegraf } = require("telegraf");

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);

const checkTLoginState = async (userId, channelId) => {
  try {
    const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;

    const chatMemberIds = await bot.telegram
      .getChatAdministrators(`@${channelUsername}`)
      .then((admins) => admins.map((admin) => admin.user.id));

    if (chatMemberIds.includes(userId)) {
      // console.log("User is in the channel");
      return true;
    } else {
      // console.log("User is not in the channel");
      return false;
    }
  } catch (error) {
    console.error("Error checking login state:", error);
    throw error;
    return false;
  }
};

// Create Telegram Invite Code.
const createTelegramInvite = async () => {
  try {
    const channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME;

    const apiUrl = `https://api.telegram.org/bot${botToken}/exportChatInviteLink`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: `@${channelUsername}`,
      }),
    });

    const result = await response.json();
    // console.log(result);

    if (result.ok) {
      const inviteLink = result.result;
      // const inviteCode = inviteLink.split("/").pop();
      return inviteLink;
    } else {
      console.error("Error creating invite link:", result.description);
      return null;
    }
  } catch (error) {
    console.error("Error getting Telegram invite code:", error.message);
    return null;
  }
};

module.exports = { createTelegramInvite, checkTLoginState };
