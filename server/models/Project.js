const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    startDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);