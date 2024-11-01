const express = require("express");
const { fetchRuns } = require("../controllers/activityController");

const router = express.Router();

// Route to fetch all activities (runs)
router.get("/activities", fetchRuns);
router.get("/", fetchRuns);

module.exports = router;
