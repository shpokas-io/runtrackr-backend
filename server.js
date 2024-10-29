require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/indexRoutes"); // Import other routes
const shoeRoutes = require("./routes/shoeRoutes"); // Import shoe routes

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // Remove deprecated options for MongoDB driver
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Use the shoe route and other routes
app.use("/api/shoes", shoeRoutes); // Hardcoded shoes route
app.use("/auth/strava", routes.stravaAuth);
app.use("/api", routes.api); // Other API routes

// Start express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
