require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/indexRoutes");
const shoeRoutes = require("./routes/shoeRoutes");

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/shoes", shoeRoutes);
app.use("/auth/strava", routes.stravaAuth);
app.use("/api/runs", routes.api);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
