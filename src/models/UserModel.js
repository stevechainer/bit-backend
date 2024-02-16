const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: String,
  telegram_id: String,
  telegram_invite: String,
  discord_id: String,
  discord_invite: String,
  pts: Number,
});

const UserModel = mongoose.model("User", userSchema);

// Function to get all pts values
UserModel.getAllPts = async function () {
  try {
    const users = await this.find({}, { _id: 0, pts: 1 });
    const ptsArray = users.map((user) => user.pts);
    return ptsArray;
  } catch (error) {
    throw error;
  }
};

// Function to get pts by user ID
UserModel.getPtsByUserId = async function (user) {
  try {
    const data = await this.findOne({ user: user });
    if (data) {
      return data.pts;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw error;
  }
};

// Function to increase pts by User ID
UserModel.increaseByUserId = async function (user, pts) {
  let currentPts = await this.getPtsByUserId(user);

  try {
    this.findOneAndUpdate({ user: user }, currentPts + pts)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  } catch (error) {
    throw error;
  }
};

// Function to decrease pts by User ID
UserModel.decreaseByUserId = async function (user, pts) {
  let currentPts = await this.getPtsByUserId(user);

  if (currentPts - pts < 0) {
    return;
  }

  try {
    this.findOneAndUpdate({ user: user }, currentPts - pts)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  } catch (error) {
    throw error;
  }
};

module.exports = UserModel;
