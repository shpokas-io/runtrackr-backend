const express = require("express");
const { getShoeStats } = require("../controllers/shoeController");

const router = express.Router();

router.get("/", getShoeStats);

module.exports = router;
