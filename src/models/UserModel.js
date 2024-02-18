const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: String,
  telegram_id: String,
  telegram_invite: String,
  discord_id: String,
  discord_invite: String,
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
    );

    console.log(users);

    return users;
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
