const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const { getTelegramInviteCode } = require("../utils/telegram");
const { createDiscordInvite } = require("../utils/discord");

// Define your routes here
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submit_get_invite", async (req, res) => {
  console.log("/users/submit_get_invite");
  try {
    const { user, telegram_id, discord_id, isX } = req.body;

    // Get Telegram invite code
    const telegram_invite = await getTelegramInviteCode(telegram_id);

    // Get Discord invite code
    const discord_invite = await createDiscordInvite(); // userid: invite id
    console.log(discord_invite);

    const pts = 100;
    // Save user to MongoDB
    const newUser = new UserModel({
      user,
      telegram_id,
      telegram_invite,
      discord_id,
      discord_invite,
      pts,
    });

    await newUser.save();

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
