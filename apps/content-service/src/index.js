require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (content-service)"))
  .catch(err => console.error("Mongo error", err));

// Routes
const contentRoutes = require("./routes/contentRoutes");
app.use("/api/content", contentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`📦 Content Service running on port ${PORT}`);
});
