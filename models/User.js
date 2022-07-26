const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "avatar.png",
    required: [true, "provide avatar"],
  },
  name: {
    type: String,
    default: "John Doe",
    required: [true, "Please name"],
  },
  date: {
    type: String,
    default: "09/08/2001",
  },
  email: {
    type: String,
    required: [true, "Please email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: [true, "Please email"],
  },
  work: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Provide phone"],
  },
  address: {
    type: String,
  },
  summary: {
    type: String,
    require: [true, "provide summary"],
  },
  description: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Provide password"],
  },
  cv: {
    type: String,
  },
});
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", userSchema);
