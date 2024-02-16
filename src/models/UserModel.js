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

module.exports = UserModel;
