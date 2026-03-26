const express = require("express");
const router = express.Router();
const {
  getDraws,
  getLatestDraw,
  simulateDraw,
  publishDraw,
  getWinners,
} = require("../controllers/drawController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

router.get("/", getDraws);
router.get("/winners", getWinners); 
router.get("/latest", getLatestDraw);
router.post("/simulate", protect, adminOnly, simulateDraw);
router.post("/:id/publish", protect, adminOnly, publishDraw);

module.exports = router;
