const express = require("express");

const {
  addComment,
  getTaskComments,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:taskId", protect, addComment);

router.get("/:taskId", protect, getTaskComments);

module.exports = router;