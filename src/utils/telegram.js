require("dotenv").config();

const getTelegramInviteCode = async (telegramUserId) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
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
      const inviteCode = inviteLink.split("/").pop();
      return inviteCode;
    } else {
      console.error("Error creating invite link:", result.description);
      return null;
    }
  } catch (error) {
    console.error("Error getting Telegram invite code:", error.message);
    return null;
  }
};

module.exports = { getTelegramInviteCode };
