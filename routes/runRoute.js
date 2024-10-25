const express = require("express");
const { getLastRun } = require("../controllers/runController");

const router = express.Router();

router.get("/", getLastRun);

module.exports = router;
