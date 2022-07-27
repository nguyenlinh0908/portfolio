const mongoose = require("mongoose");
const date = new Date();
const optSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: [true, "provide otp"],
  },
  verify: {
    type: Boolean,
    default: false,
  },
  expiration_time: {
    type: Date,
    default: date.setTime(date.getTime() + 3 * 60 * 1000), // 3' valid
  },
  created_at: {
    type: Date,
    // default: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    default: date.toString(),
    required: [true, "provide create at"],
  },
  update_at: {
    type: Date,
    default: date.toString(),
    required: [true, "provide update at"],
  },
});
module.exports = mongoose.model("Otp", optSchema);
