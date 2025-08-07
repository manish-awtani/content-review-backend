// apps/auth-service/src/index.js
require("module-alias/register");
require("dotenv").config();
const express = require("express");
const connectDB = require("@@/database/database");
const redisClient = require("@@/database/redis");

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Debug

// Connect to MongoDB
connectDB();

// Check Redis connection
redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("❌ Redis error", err));

// Add routes here later (e.g., /api/auth)

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Auth Service running on port ${PORT}`);
});
