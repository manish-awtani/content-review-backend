require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const redis = require("./config/redis");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(require("cookie-parser")());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
