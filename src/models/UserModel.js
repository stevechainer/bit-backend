const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  telegram_id: {
    type: String,
    default: "", // Set default value to an empty string
  },
  telegram_invite: {
    type: String,
    default: "", // Set default value to an empty string
  },
  discord_id: {
    type: String,
    default: "", // Set default value to an empty string
  },
  discord_invite: {
    type: String,
    default: "", // Set default value to an empty string
  },
  totalPts: {
    type: Number,
    default: 0,
  },
  ptsPerDay: {
    type: Number,
    default: 0,
  },
  referralPts: {
    type: Number,
    default: 0,
  },
  bonusPts: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.model("User", userSchema);

// Function to get all pts values
UserModel.getAllPts = async function () {
  try {
    const users = await this.find(
      {},
      "address totalPts ptsPerDay referralPts bonusPts -_id"
    ).sort({ totalPts: -1 });

    // Add a 'ranking' field to each user based on the order of totalPts
    const rankedUsers = users.map((user, index) => ({
      ...user._doc,
      rank: index + 1,
    }));

    console.log(rankedUsers);

    return rankedUsers;
  } catch (error) {
    throw error;
  }
};

// Get Pts by user id.
UserModel.getPtsByUserId = async function (user) {
  try {
    const data = await this.findOne({ user: user });

    if (!data) {
      throw new Error("User not found");
    }

    return data.pts;
  } catch (error) {
    throw error;
  }
};

// Function to increase pts by User ID
UserModel.increaseByUserId = async function (user, pts) {
  try {
    await this.findOneAndUpdate(
      { user: user },
      { $inc: { pts: pts } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// Function to decrease pts by User ID
UserModel.decreaseByUserId = async function (user, pts) {
  try {
    await this.findOneAndUpdate(
      { user: user },
      { $inc: { pts: -pts } },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = UserModel;
