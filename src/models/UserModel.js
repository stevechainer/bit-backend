const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: String,
  telegram_id: String,
  telegram_invite: String,
  discord_id: String,
  discord_invite: String,
  pts: {
    type: Number,
    default: 0,
  },
  refPts: {
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
      { _id: 0, user: 1, pts: 1, refPts: 1, bonusPts: 1 }
    );

    const ptsMap = new Map(
      users.map((user) => [
        user.user,
        { pts: user.pts, refPts: user.refPts, bonusPts: user.bonusPts },
      ])
    );

    return ptsMap;
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
