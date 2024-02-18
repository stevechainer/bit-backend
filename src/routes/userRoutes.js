const express = require("express");
const router = express.Router();
const userModel = require("../models/UserModel");
const { createTelegramInvite, checkTLoginState } = require("../utils/telegram");
const { createDiscordInvite } = require("../utils/discord");

// checkLoginState
const checkLoginState = async (userId, appType) => {
  let loggined = false;
  if (appType == process.env.TELEGRAM) {
    loggined = await checkTLoginState(userId, process.env.TELEGRAM);

    if (loggined) {
      // add pts to users
    }
  }

  if (appType == process.env.DISCORD) {
    // loggined = await checkDLoginState(userId, process.env.TELEGRAM);
    // if (loggined) {
    //   // add pts to users
    // }
  }
};

// Define your routes here
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
router.post("/social", async (req, res) => {
  console.log("/social");
  try {
    const { address, isTwitter, telegramId, discordId } = req.body;

    let telegramInvite = "";
    let = "";

    // Validate telegramId
    if (
      telegramId &&
      typeof telegramId === "string" &&
      telegramId.trim() !== ""
    ) {
      // Get Telegram invite code
      telegramInvite = await createTelegramInvite();
    }

    // Validate discord_id
    if (discordId && typeof discordId === "string" && discordId.trim() !== "") {
      // Get Discord invite code
      discordInvite = await createDiscordInvite();

      // Check login state.
      checkLoginState(discordId, process.env.TELEGRAM);
    }

    // Save user to MongoDB
    const newUser = new userModel({
      address,
      telegramId,
      telegramInvite,
      discordId,
      discordInvite,
    });

    // Save user info.
    await newUser.save();

    // Send invite code.
    let data = {
      twitterUrl: "null",
      telegramUrl: telegramInvite,
      discordUrl: discordInvite,
    };

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all pts for users.
router.get("/points", async (req, res) => {
  try {
    const ptsMap = await userModel.getAllPts();

    console.log("=======================");
    // Convert Map to plain JavaScript object

    res.status(200).json(ptsMap);
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
