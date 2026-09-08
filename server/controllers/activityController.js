const Activity = require("../models/Activity");

const getProjectActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      project: req.params.projectId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      activities,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getProjectActivities,
};