const express = require("express");
const { fetchRuns } = require("../controllers/api");

const router = express.Router();

// Route to fetch all runs
router.get("/runs", (req, res) => fetchRuns(req, res));

module.exports = router;
