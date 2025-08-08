// content-service/src/models/Content.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String },
  media: [{ type: String }], // Array of URLs (images, videos)
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
