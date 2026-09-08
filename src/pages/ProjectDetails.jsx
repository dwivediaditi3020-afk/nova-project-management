import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // PROJECT STATE
  // =====================================================

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showProjectEdit, setShowProjectEdit] = useState(false);

  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDescription, setEditProjectDescription] =
    useState("");
  const [editProjectStatus, setEditProjectStatus] =
    useState("Not Started");
  const [editProjectStartDate, setEditProjectStartDate] =
    useState("");
  const [editProjectDueDate, setEditProjectDueDate] =
    useState("");

  const [projectMessage, setProjectMessage] = useState("");
  const [projectError, setProjectError] = useState("");

  // =====================================================
  // TEAM STATE
  // =====================================================

  const [members, setMembers] = useState([]);

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberMessage, setMemberMessage] = useState("");
  const [memberError, setMemberError] = useState("");

  // =====================================================
  // TASK STATE
  // =====================================================

  const [tasks, setTasks] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Edit Task
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] =
    useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("To Do");
  const [editTaskPriority, setEditTaskPriority] =
    useState("Medium");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  // =====================================================
  // PROGRESS STATE
  // =====================================================

  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    progress: "0%",
  });

  // =====================================================
  // COMMENTS STATE
  // =====================================================

  const [taskComments, setTaskComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  // =====================================================
  // ACTIVITY STATE
  // =====================================================

  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // =====================================================
  // FETCH PROJECT DATA
  // =====================================================

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // =================================================
      // GET PROJECT
      // =================================================

      const projectResponse = await api.get("/projects");

      const foundProject =
        projectResponse.data.projects.find(
          (item) => item._id === id
        );

      setProject(foundProject);
      setMembers(foundProject?.members || []);

      // =================================================
      // GET TASKS
      // =================================================

      const taskResponse = await api.get(
        `/tasks/project/${id}`
      );

      const projectTasks = taskResponse.data.tasks;

      setTasks(projectTasks);

      // =================================================
      // GET COMMENTS FOR EACH TASK
      // =================================================

      const commentsData = {};

      for (const task of projectTasks) {
        try {
          const commentResponse = await api.get(
            `/comments/${task._id}`
          );

          commentsData[task._id] =
            commentResponse.data.comments || [];
        } catch (error) {
          console.log(
            `COMMENTS ERROR FOR TASK ${task._id}:`,
            error.response?.data
          );

          commentsData[task._id] = [];
        }
      }

      setTaskComments(commentsData);

      // =================================================
      // GET PROGRESS
      // =================================================

      try {
        const progressResponse = await api.get(
          `/projects/${id}/progress`
        );

        setProgress(progressResponse.data);
      } catch (error) {
        console.log(
          "PROGRESS ERROR:",
          error.response?.data
        );
      }

      // =================================================
      // GET ACTIVITY
      // =================================================

      try {
        setActivityLoading(true);

        const activityResponse = await api.get(
          `/activities/project/${id}`
        );

        setActivities(
          activityResponse.data.activities || []
        );
      } catch (error) {
        console.log(
          "ACTIVITY FETCH ERROR:",
          error.response?.data
        );
      } finally {
        setActivityLoading(false);
      }
    } catch (error) {
      console.log(
        "PROJECT DETAILS ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load project details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  // =====================================================
  // PROJECT EDIT
  // =====================================================

  const handleStartProjectEdit = () => {
    setEditProjectName(project.name);

    setEditProjectDescription(
      project.description || ""
    );

    setEditProjectStatus(project.status);

    setEditProjectStartDate(
      project.startDate
        ? new Date(project.startDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setEditProjectDueDate(
      project.dueDate
        ? new Date(project.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setProjectMessage("");
    setProjectError("");

    setShowProjectEdit(true);
  };

  const handleCancelProjectEdit = () => {
    setShowProjectEdit(false);

    setEditProjectName("");
    setEditProjectDescription("");
    setEditProjectStatus("Not Started");
    setEditProjectStartDate("");
    setEditProjectDueDate("");

    setProjectMessage("");
    setProjectError("");
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    setProjectMessage("");
    setProjectError("");

    try {
      const response = await api.put(
        `/projects/${id}`,
        {
          name: editProjectName,
          description: editProjectDescription,
          status: editProjectStatus,
          startDate: editProjectStartDate,
          dueDate: editProjectDueDate,
        }
      );

      setProject(response.data.project);

      setProjectMessage(
        "Project updated successfully."
      );

      setShowProjectEdit(false);

      await fetchProjectData();
    } catch (error) {
      console.log(
        "UPDATE PROJECT ERROR:",
        error.response?.data
      );

      setProjectError(
        error.response?.data?.message ||
          "Unable to update project."
      );
    }
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);

      alert("Project deleted successfully.");

      navigate("/projects");
    } catch (error) {
      console.log(
        "DELETE PROJECT ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    }
  };

  // =====================================================
  // ADD TEAM MEMBER
  // =====================================================

  const handleAddMember = async (e) => {
    e.preventDefault();

    setMemberMessage("");
    setMemberError("");

    try {
      const response = await api.post(
        `/projects/${id}/members`,
        {
          userId: memberUserId,
        }
      );

      setMemberMessage(response.data.message);
      setMemberUserId("");

      await fetchProjectData();

      setShowMemberForm(false);
    } catch (error) {
      console.log(
        "ADD MEMBER ERROR:",
        error.response?.data
      );

      setMemberError(
        error.response?.data?.message ||
          "Unable to add member."
      );
    }
  };

  // =====================================================
  // CREATE TASK
  // =====================================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        project: id,
      };

      if (assignedTo) {
        taskData.assignedTo = assignedTo;
      }

      await api.post("/tasks", taskData);

      await fetchProjectData();

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("To Do");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setAssignedTo("");

      setShowTaskForm(false);
    } catch (error) {
      console.log(
        "CREATE TASK ERROR:",
        error.response?.data
      );
    }
  };

  // =====================================================
  // EDIT TASK
  // =====================================================

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);

    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditTaskStatus(task.status);
    setEditTaskPriority(task.priority);

    setEditTaskDueDate(
      task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setEditAssignedTo(
      task.assignedTo?._id || ""
    );
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);

    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskStatus("To Do");
    setEditTaskPriority("Medium");
    setEditTaskDueDate("");
    setEditAssignedTo("");
  };

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        title: editTaskTitle,
        description: editTaskDescription,
        status: editTaskStatus,
        priority: editTaskPriority,
        dueDate: editTaskDueDate,
      };

      if (editAssignedTo) {
        taskData.assignedTo = editAssignedTo;
      }

      await api.put(
        `/tasks/${editingTaskId}`,
        taskData
      );

      await fetchProjectData();

      handleCancelEdit();
    } catch (error) {
      console.log(
        "UPDATE TASK ERROR:",
        error.response?.data
      );
    }
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);

      if (editingTaskId === taskId) {
        handleCancelEdit();
      }

      await fetchProjectData();
    } catch (error) {
      console.log(
        "DELETE TASK ERROR:",
        error.response?.data
      );
    }
  };

  // =====================================================
  // ADD COMMENT TO TASK
  // =====================================================

  const handleAddComment = async (e, taskId) => {
    e.preventDefault();

    const text = commentText[taskId]?.trim();

    if (!text) {
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      await api.post(
        `/comments/${taskId}`,
        {
          text,
        }
      );

      const response = await api.get(
        `/comments/${taskId}`
      );

      setTaskComments((previous) => ({
        ...previous,
        [taskId]:
          response.data.comments || [],
      }));

      setCommentText((previous) => ({
        ...previous,
        [taskId]: "",
      }));
    } catch (error) {
      console.log(
        "ADD COMMENT ERROR:",
        error.response?.data
      );

      setCommentError(
        error.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading project...
        </p>

      </div>
    );
  }

  // =====================================================
  // PROJECT ERROR / NOT FOUND
  // =====================================================

  if (!project) {
    return (
      <div className="container mt-5">

        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">

            <div className="text-danger fs-1 mb-3">
              ⚠️
            </div>

            <h4 className="fw-bold mb-2">
              {errorMessage
                ? "Unable to load project"
                : "Project not found"}
            </h4>

            <p className="text-muted mb-4">
              {errorMessage ||
                "The project you are looking for does not exist or may have been removed."}
            </p>

            <Link
              to="/projects"
              className="btn btn-primary"
            >
              ← Back to Projects
            </Link>

          </div>
        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="container mt-4 pb-5">

      {/* BACK */}
      <div className="mb-3">

        <Link
          to="/projects"
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Projects
        </Link>

      </div>

      {/* PROJECT HEADER */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">

            <div className="flex-grow-1">

              <h2 className="mb-2">
                {project.name}
              </h2>

              <p className="text-muted mb-0">
                {project.description ||
                  "No description available."}
              </p>

            </div>

            <span className="badge bg-primary fs-6 align-self-start">
              {project.status}
            </span>

          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleStartProjectEdit}
            >
              ✏️ Edit Project
            </button>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDeleteProject}
            >
              🗑️ Delete Project
            </button>

          </div>

          {projectMessage && (
            <div className="alert alert-success mt-3 mb-0">
              {projectMessage}
            </div>
          )}

          {projectError && (
            <div className="alert alert-danger mt-3 mb-0">
              {projectError}
            </div>
          )}

        </div>

      </div>

      {/* EDIT PROJECT */}
      {showProjectEdit && (
        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Edit Project
            </h5>

            <form onSubmit={handleUpdateProject}>

              <div className="mb-3">

                <label className="form-label">
                  Project Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={editProjectName}
                  onChange={(e) =>
                    setEditProjectName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  value={editProjectDescription}
                  onChange={(e) =>
                    setEditProjectDescription(
                      e.target.value
                    )
                  }
                ></textarea>

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  value={editProjectStatus}
                  onChange={(e) =>
                    setEditProjectStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="Not Started">
                    Not Started
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Start Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={editProjectStartDate}
                    onChange={(e) =>
                      setEditProjectStartDate(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Due Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={editProjectDueDate}
                    onChange={(e) =>
                      setEditProjectDueDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              <div className="d-flex flex-wrap gap-2">

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelProjectEdit}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* PROJECT INFORMATION */}
      <div className="row g-4">

        {/* TIMELINE */}
        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <h5 className="mb-3">
                📅 Project Timeline
              </h5>

              <p>
                <strong>Start Date:</strong>{" "}
                {project.startDate
                  ? new Date(
                      project.startDate
                    ).toLocaleDateString()
                  : "Not set"}
              </p>

              <p className="mb-0">
                <strong>Due Date:</strong>{" "}
                {project.dueDate
                  ? new Date(
                      project.dueDate
                    ).toLocaleDateString()
                  : "Not set"}
              </p>

            </div>

          </div>

        </div>

        {/* PROGRESS */}
        <div className="col-md-6">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <h5 className="mb-3">
                📊 Project Progress
              </h5>

              <div className="d-flex justify-content-between mb-2">

                <span>
                  Completed Tasks
                </span>

                <strong>
                  {progress.completedTasks}/
                  {progress.totalTasks}
                </strong>

              </div>

              <div
                className="progress mb-3"
                style={{ height: "22px" }}
              >

                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: progress.progress,
                  }}
                >
                  {progress.progress}
                </div>

              </div>

              <div className="row text-center">

                <div className="col-4">

                  <h5>
                    {progress.totalTasks}
                  </h5>

                  <small className="text-muted">
                    Total
                  </small>

                </div>

                <div className="col-4">

                  <h5>
                    {progress.completedTasks}
                  </h5>

                  <small className="text-muted">
                    Completed
                  </small>

                </div>

                <div className="col-4">

                  <h5>
                    {progress.pendingTasks}
                  </h5>

                  <small className="text-muted">
                    Pending
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* TEAM */}
      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">

            <h5 className="mb-0">
              👥 Team
            </h5>

            <button
              className="btn btn-outline-primary btn-sm align-self-start align-self-sm-auto"
              onClick={() =>
                setShowMemberForm(
                  !showMemberForm
                )
              }
            >
              + Add Member
            </button>

          </div>

          <p>
            <strong>
              Team Members:
            </strong>{" "}
            {members.length}
          </p>

          {members.length > 0 ? (
            <div className="list-group mb-3">

              {members.map((member) => (

                <div
                  key={member._id}
                  className="list-group-item"
                >

                  <strong>
                    {member.name}
                  </strong>

                  <div className="text-muted small">
                    {member.email}
                  </div>

                </div>

              ))}

            </div>
          ) : (
            <p className="text-muted">
              No team members added yet.
            </p>
          )}

          {showMemberForm && (
            <form
              className="border rounded p-3 bg-light"
              onSubmit={handleAddMember}
            >

              <h6 className="mb-3">
                Add Team Member
              </h6>

              <label className="form-label">
                User ID
              </label>

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter user ID"
                value={memberUserId}
                onChange={(e) =>
                  setMemberUserId(
                    e.target.value
                  )
                }
                required
              />

              <small className="text-muted d-block mb-3">
                Enter the User ID of an existing
                NOVA user.
              </small>

              {memberMessage && (
                <div className="alert alert-success py-2">
                  {memberMessage}
                </div>
              )}

              {memberError && (
                <div className="alert alert-danger py-2">
                  {memberError}
                </div>
              )}

              <div className="d-flex flex-wrap gap-2">

                <button
                  type="submit"
                  className="btn btn-success btn-sm"
                >
                  Add Member
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowMemberForm(false);
                    setMemberUserId("");
                    setMemberMessage("");
                    setMemberError("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>

      </div>

      {/* TASKS */}
      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">

            <h5 className="mb-0">
              📋 Project Tasks
            </h5>

            <div className="d-flex flex-wrap align-items-center gap-2">

              <span className="badge bg-secondary">
                {tasks.length} Tasks
              </span>

              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setShowTaskForm(
                    !showTaskForm
                  )
                }
              >
                + Create Task
              </button>

            </div>

          </div>

          {/* CREATE TASK */}
          {showTaskForm && (
            <form
              className="card bg-light border-0 mb-4"
              onSubmit={handleCreateTask}
            >

              <div className="card-body">

                <h6 className="mb-3">
                  Create New Task
                </h6>

                <div className="mb-3">

                  <label className="form-label">
                    Task Title
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={(e) =>
                      setTaskTitle(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter task description"
                    value={taskDescription}
                    onChange={(e) =>
                      setTaskDescription(
                        e.target.value
                      )
                    }
                  ></textarea>

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Status
                    </label>

                    <select
                      className="form-select"
                      value={taskStatus}
                      onChange={(e) =>
                        setTaskStatus(
                          e.target.value
                        )
                      }
                    >

                      <option value="To Do">
                        To Do
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                    </select>

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Priority
                    </label>

                    <select
                      className="form-select"
                      value={taskPriority}
                      onChange={(e) =>
                        setTaskPriority(
                          e.target.value
                        )
                      }
                    >

                      <option value="Low">
                        Low
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="High">
                        High
                      </option>

                    </select>

                  </div>

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Due Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={taskDueDate}
                    onChange={(e) =>
                      setTaskDueDate(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Assigned To
                  </label>

                  <select
                    className="form-select"
                    value={assignedTo}
                    onChange={(e) =>
                      setAssignedTo(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select team member
                    </option>

                    {members.map((member) => (

                      <option
                        key={member._id}
                        value={member._id}
                      >
                        {member.name} (
                        {member.email})
                      </option>

                    ))}

                  </select>

                  {members.length === 0 && (
                    <small className="text-muted">
                      Add a team member first to
                      assign this task.
                    </small>
                  )}

                </div>

                <div className="d-flex flex-wrap gap-2">

                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Create Task
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setShowTaskForm(false)
                    }
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </form>
          )}

          {/* TASK TABLE */}
          {tasks.length === 0 ? (

            <div className="alert alert-info mb-0">
              No tasks have been created for this
              project yet.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead>

                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {tasks.map((task) => (

                    <tr key={task._id}>

                      {editingTaskId === task._id ? (

                        <td colSpan="6">

                          <form
                            className="border rounded p-3 bg-light"
                            onSubmit={handleUpdateTask}
                          >

                            <h6 className="mb-3">
                              Edit Task
                            </h6>

                            <div className="mb-3">

                              <label className="form-label">
                                Task Title
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                value={editTaskTitle}
                                onChange={(e) =>
                                  setEditTaskTitle(
                                    e.target.value
                                  )
                                }
                                required
                              />

                            </div>

                            <div className="mb-3">

                              <label className="form-label">
                                Description
                              </label>

                              <textarea
                                className="form-control"
                                rows="3"
                                value={editTaskDescription}
                                onChange={(e) =>
                                  setEditTaskDescription(
                                    e.target.value
                                  )
                                }
                              ></textarea>

                            </div>

                            <div className="row">

                              <div className="col-md-6 mb-3">

                                <label className="form-label">
                                  Status
                                </label>

                                <select
                                  className="form-select"
                                  value={editTaskStatus}
                                  onChange={(e) =>
                                    setEditTaskStatus(
                                      e.target.value
                                    )
                                  }
                                >

                                  <option value="To Do">
                                    To Do
                                  </option>

                                  <option value="In Progress">
                                    In Progress
                                  </option>

                                  <option value="Completed">
                                    Completed
                                  </option>

                                </select>

                              </div>

                              <div className="col-md-6 mb-3">

                                <label className="form-label">
                                  Priority
                                </label>

                                <select
                                  className="form-select"
                                  value={editTaskPriority}
                                  onChange={(e) =>
                                    setEditTaskPriority(
                                      e.target.value
                                    )
                                  }
                                >

                                  <option value="Low">
                                    Low
                                  </option>

                                  <option value="Medium">
                                    Medium
                                  </option>

                                  <option value="High">
                                    High
                                  </option>

                                </select>

                              </div>

                            </div>

                            <div className="mb-3">

                              <label className="form-label">
                                Due Date
                              </label>

                              <input
                                type="date"
                                className="form-control"
                                value={editTaskDueDate}
                                onChange={(e) =>
                                  setEditTaskDueDate(
                                    e.target.value
                                  )
                                }
                              />

                            </div>

                            <div className="mb-3">

                              <label className="form-label">
                                Assigned To
                              </label>

                              <select
                                className="form-select"
                                value={editAssignedTo}
                                onChange={(e) =>
                                  setEditAssignedTo(
                                    e.target.value
                                  )
                                }
                              >

                                <option value="">
                                  Unassigned
                                </option>

                                {members.map((member) => (

                                  <option
                                    key={member._id}
                                    value={member._id}
                                  >
                                    {member.name} (
                                    {member.email})
                                  </option>

                                ))}

                              </select>

                            </div>

                            <div className="d-flex flex-wrap gap-2">

                              <button
                                type="submit"
                                className="btn btn-success"
                              >
                                Save Changes
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={
                                  handleCancelEdit
                                }
                              >
                                Cancel
                              </button>

                            </div>

                          </form>

                        </td>

                      ) : (

                        <>

                          <td>

                            <strong>
                              {task.title}
                            </strong>

                            {task.description && (
                              <div className="text-muted small">
                                {task.description}
                              </div>
                            )}

                          </td>

                          <td>

                            {task.assignedTo ? (
                              <>
                                <strong>
                                  {task.assignedTo.name}
                                </strong>

                                <div className="text-muted small">
                                  {task.assignedTo.email}
                                </div>
                              </>
                            ) : (
                              <span className="text-muted">
                                Unassigned
                              </span>
                            )}

                          </td>

                          <td>

                            <span className="badge bg-primary">
                              {task.status}
                            </span>

                          </td>

                          <td>

                            <span className="badge bg-secondary">
                              {task.priority}
                            </span>

                          </td>

                          <td>

                            {task.dueDate
                              ? new Date(
                                  task.dueDate
                                ).toLocaleDateString()
                              : "Not set"}

                          </td>

                          <td>

                            <div className="d-flex flex-wrap gap-2">

                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleEditTask(task)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDeleteTask(
                                    task._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </>

                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* COMMENTS */}
      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <h5 className="mb-3">
            💬 Task Comments & Collaboration
          </h5>

          <p className="text-muted">
            Comments are attached to individual tasks.
          </p>

          {commentError && (
            <div className="alert alert-danger">
              {commentError}
            </div>
          )}

          {tasks.length === 0 ? (

            <p className="text-muted mb-0">
              Create a task first to start a discussion.
            </p>

          ) : (

            <div>

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className="border rounded p-3 mb-3"
                >

                  <h6 className="mb-3">
                    📋 {task.title}
                  </h6>

                  {/* Existing comments */}
                  {taskComments[task._id]?.length > 0 ? (

                    <div className="list-group mb-3">

                      {taskComments[task._id].map(
                        (comment) => (

                          <div
                            key={comment._id}
                            className="list-group-item"
                          >

                            <div className="d-flex flex-wrap justify-content-between gap-2">

                              <strong>
                                {comment.user?.name ||
                                  "User"}
                              </strong>

                              {comment.createdAt && (
                                <small className="text-muted">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleString()}
                                </small>
                              )}

                            </div>

                            <p className="mb-0 mt-2">
                              {comment.text}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-muted small">
                      No comments on this task yet.
                    </p>

                  )}

                  {/* Add comment */}
                  <form
                    onSubmit={(e) =>
                      handleAddComment(
                        e,
                        task._id
                      )
                    }
                  >

                    <textarea
                      className="form-control mb-2"
                      rows="2"
                      placeholder={`Comment on "${task.title}"...`}
                      value={
                        commentText[task._id] || ""
                      }
                      onChange={(e) =>
                        setCommentText(
                          (previous) => ({
                            ...previous,
                            [task._id]:
                              e.target.value,
                          })
                        )
                      }
                    ></textarea>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      disabled={commentLoading}
                    >
                      {commentLoading
                        ? "Posting..."
                        : "Post Comment"}
                    </button>

                  </form>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ACTIVITY HISTORY */}
      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <h5 className="mb-3">
            🕒 Activity History
          </h5>

          {activityLoading ? (

            <p className="text-muted">
              Loading activity...
            </p>

          ) : activities.length === 0 ? (

            <p className="text-muted mb-0">
              No activity recorded yet.
            </p>

          ) : (

            <div className="list-group">

              {activities.map((activity) => (

                <div
                  key={activity._id}
                  className="list-group-item"
                >

                  <div>

                    <strong>
                      {activity.user?.name ||
                        "User"}
                    </strong>{" "}

                    <span>
                      {activity.action}
                    </span>

                  </div>

                  {activity.createdAt && (
                    <small className="text-muted">
                      {new Date(
                        activity.createdAt
                      ).toLocaleString()}
                    </small>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProjectDetails;