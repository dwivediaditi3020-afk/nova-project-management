const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const Activity = require("../models/Activity");

// Create a project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      dueDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      startDate,
      dueDate,
      owner: req.userId,
    });

    await Activity.create({
      action: `Created project "${project.name}"`,
      user: req.userId,
      project: project._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all projects of logged-in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.userId,
    })
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      dueDate,
    } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.name = name || project.name;
    project.description =
      description ?? project.description;
    project.status = status || project.status;
    project.startDate =
      startDate || project.startDate;
    project.dueDate =
      dueDate || project.dueDate;

    await project.save();

    await Activity.create({
      action: `Updated project "${project.name}"`,
      user: req.userId,
      project: project._id,
    });

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project =
      await Project.findOneAndDelete({
        _id: req.params.id,
        owner: req.userId,
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Add member to project
const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        message: "User is already a member",
      });
    }

    project.members.push(userId);

    await project.save();

    await Activity.create({
      action: `Added ${user.name} to project "${project.name}"`,
      user: req.userId,
      project: project._id,
    });

    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get project progress
const getProjectProgress = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.id,
    });

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pendingTasks =
      totalTasks - completedTasks;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      progress: `${progress}%`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addMemberToProject,
  getProjectProgress,
};
