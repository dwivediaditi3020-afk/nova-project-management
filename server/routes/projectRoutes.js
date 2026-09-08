const express = require("express");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMemberToProject,
  getProjectProgress,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);

router.post("/:id/members", protect, addMemberToProject);

router.get("/:id/progress", protect, getProjectProgress);

router.get("/", protect, getProjects);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;