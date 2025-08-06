const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: String,
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
