// apps/auth-service/src/index.js
const express = require("express");
const connectDB = require("../../../libs/database/database");
const redisClient = require("../../../libs/database/redis");

const app = express();
const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(express.json());

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
