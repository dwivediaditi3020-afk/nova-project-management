const express = require("express");

const {
  getProjectActivities,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/project/:projectId", protect, getProjectActivities);

module.exports = router;