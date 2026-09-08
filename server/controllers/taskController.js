const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");

// Create a task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required",
      });
    }

    const projectExists = await Project.findOne({
  _id: project,
  $or: [
    { owner: req.userId },
    { members: req.userId },
  ],
});

if (!projectExists) {
  return res.status(403).json({
    message: "You do not have access to this project",
  });
}

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.userId,
    });

    await Activity.create({
        action: `Created task "${task.title}"`,
        user: req.userId,
        project: task.project,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all tasks of a project
const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { owner: req.userId },
        { members: req.userId },
      ],
    });

    if (!project) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

   const task = await Task.findOne({
    _id: req.params.id,
    createdBy: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.title = title || task.title;
    task.description = description ?? task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
};