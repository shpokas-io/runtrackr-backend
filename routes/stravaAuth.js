const express = require("express");
const { getAuthUrl, handleAuthCallback } = require("../controllers/stravaAuth");

const router = express.Router();

// Strava Auth Callback Route
router.get("/", (req, res) => getAuthUrl(req, res));

// Callback route to handle auth
router.get("/callback", (req, res) => handleAuthCallback(req, res));

module.exports = router;
