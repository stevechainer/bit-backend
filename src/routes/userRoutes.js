const express = require("express");
const router = express.Router();
const userModel = require("../models/UserModel");
const { createTelegramInviteCode } = require("../utils/telegram");
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

//
router.post("/submit_get_invite", async (req, res) => {
  console.log("/submit_get_invite");
  try {
    const { user, telegram_id, discord_id, isX } = req.body;
    const pts = 0;
    let telegram_invite = "";
    let discord_invite = "";

    // Validate telegram_id
    if (
      telegram_id &&
      typeof telegram_id === "string" &&
      telegram_id.trim() !== ""
    ) {
      // Get Telegram invite code
      telegram_invite = await createTelegramInviteCode();
    }

    // Validate discord_id
    if (
      discord_id &&
      typeof discord_id === "string" &&
      discord_id.trim() !== ""
    ) {
      // Get Discord invite code
      discord_invite = await createDiscordInvite();
    }

    // Save user to MongoDB
    const newUser = new userModel({
      user,
      telegram_id,
      telegram_invite,
      discord_id,
      discord_invite,
      pts,
    });

    // Save user info.
    await newUser.save();

    // Send invite code.
    let data = {
      success: true,
      invites: {
        telegram_invite,
        discord_invite,
      },
    };

    res.json(data);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all pts for users.
router.get("/all_pts", async (req, res) => {
  try {
    const ptsMap = await userModel.getAllPts();

    // Convert Map to plain JavaScript object
    const ptsObject = Object.fromEntries(ptsMap);
    res.status(200).json(ptsObject);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// updateType =  increase / decrease
router.post("/update_pts", async (req, res) => {
  try {
    const { user, pts, updateType } = req.body;

    if (updateType == 0) {
      return await userModel.increaseByUserId(user, pts);
    } else {
      return await userModel.decreaseByUserId(user, pts);
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
