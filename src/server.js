const express = require("express");
const connectDB = require("./utils/database");
const userRoutes = require("./routes/userRoutes");
const marketRoutes = require("./routes/marketRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/market", marketRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
