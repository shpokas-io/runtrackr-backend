const express = require("express");
const router = express.Router();
const Shoe = require("../models/Shoe");

// Dynamic route to get all running shoes
router.get("/", async (req, res) => {
  try {
    const shoes = await Shoe.find({ category: "running" });
    res.json(shoes);
  } catch (err) {
    console.error("Error fetching shoes:", err);
    res.status(500).json({ error: "Error fetching shoes" });
  }
});

module.exports = router;
