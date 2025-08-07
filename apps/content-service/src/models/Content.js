// content-service/src/models/Content.js

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "flagged_by_ai"], 
    default: "pending" 
  },
  aiFeedback: {
    sentiment: String,
    toxicityScore: Number,
    spamScore: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Content", contentSchema);