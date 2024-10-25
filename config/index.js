require("dotenv").config(); // Load environment variables

const config = {
  port: process.env.PORT || 5000,
  stravaClientId: process.env.STRAVA_CLIENT_ID,
  stravaClientSecret: process.env.STRAVA_CLIENT_SECRET,
  corsOrigin: "http://localhost:5173",
};

module.exports = config;
