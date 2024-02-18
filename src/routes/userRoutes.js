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

// Get Address's pts
router.get("/:id", async (req, res) => {
  try {
    const userAddress = req.params.id;

    // Find the user by address
    const user = await userModel.findOne({ address: userAddress });

    if (!user) {
      return res.send({ point: "0" });
      // return res.status(404).json({ error: "User not found" });
    }

    // Assuming you want to include the user's info and the formatted time in the response
    const data = {
      point: user.totalPts,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Social Info and set Points
router.post("/social", async (req, res) => {
  console.log("/social");
  try {
    const { address, isTwitter, telegramId, discordId } = req.body;

    let telegramInvite = "";
    let discordInvite = "";
    let twitterInvite = "";

    /* Telegram Invite Code */
    if (
      telegramId &&
      typeof telegramId === "string" &&
      telegramId.trim() !== ""
    ) {
      // Get Telegram invite code
      telegramInvite = await createTelegramInvite();

      // Add pts to users.
      await userModel.increaseByUserId(address, process.env.PTS_TELEGRAM);
    }

    /* Discord Invite Code */
    if (discordId && typeof discordId === "string" && discordId.trim() !== "") {
      // Get Discord invite code
      discordInvite = await createDiscordInvite();

      // Add pts to users.
      await userModel.increaseByUserId(address, process.env.PTS_DISCORD);
    }

    /* TWITTER Invite Code */
    if (isTwitter) {
      twitterInvite = "https://init.capital/x";
      await userModel.increaseByUserId(address, process.env.PTS_TWITTER);
    }
    /* Save Social Info */
    const newUser = new userModel({
      address,
      telegramId,
      telegramInvite,
      discordId,
      discordInvite,
    });

    await newUser.save();

    // Send invite code.
    let data = {
      twitterUrl: isTwitter ? twitterInvite : "",
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

    /* Get the current UTC time */
    const updateDate = new Date();

    // Create an object with formattedTime and ptsMap
    const resultObject = {
      updateDate: updateDate,
      points: ptsMap,
    };

    console.log(resultObject);

    res.status(200).json(resultObject);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
