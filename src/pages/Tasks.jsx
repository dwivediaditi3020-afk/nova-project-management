import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
  // =====================================================
  // MAIN STATE
  // =====================================================

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // CREATE TASK STATE
  // =====================================================

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] =
    useState("");
  const [taskStatus, setTaskStatus] =
    useState("To Do");
  const [taskPriority, setTaskPriority] =
    useState("Medium");
  const [taskDueDate, setTaskDueDate] =
    useState("");
  const [taskProject, setTaskProject] =
    useState("");
  const [taskAssignedTo, setTaskAssignedTo] =
    useState("");

  // =====================================================
  // EDIT TASK STATE
  // =====================================================

  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const [editTaskTitle, setEditTaskTitle] =
    useState("");
  const [editTaskDescription, setEditTaskDescription] =
    useState("");
  const [editTaskStatus, setEditTaskStatus] =
    useState("To Do");
  const [editTaskPriority, setEditTaskPriority] =
    useState("Medium");
  const [editTaskDueDate, setEditTaskDueDate] =
    useState("");
  const [editTaskAssignedTo, setEditTaskAssignedTo] =
    useState("");

  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  // =====================================================
  // MESSAGES
  // =====================================================

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      setProjects(response.data.projects || []);

      return response.data.projects || [];
    } catch (error) {
      console.log(
        "FETCH PROJECTS ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load projects."
      );

      return [];
    }
  };

  // =====================================================
  // FETCH TASKS
  // =====================================================

  const fetchTasks = async (projectList) => {
    try {
      let allTasks = [];

      for (const project of projectList) {
        const response = await api.get(
          `/tasks/project/${project._id}`
        );

        const projectTasks =
          response.data.tasks || [];

        allTasks = [
          ...allTasks,
          ...projectTasks.map((task) => ({
            ...task,
            projectDetails: project,
          })),
        ];
      }

      setTasks(allTasks);
    } catch (error) {
      console.log(
        "FETCH TASKS ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load tasks."
      );
    }
  };

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const projectList =
        await fetchProjects();

      await fetchTasks(projectList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // CREATE TASK
  // =====================================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        project: taskProject,
        assignedTo:
          taskAssignedTo || undefined,
      });

      setSuccessMessage(
        "Task created successfully."
      );

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("To Do");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setTaskProject("");
      setTaskAssignedTo("");

      setShowCreateForm(false);

      await loadData();
    } catch (error) {
      console.log(
        "CREATE TASK ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to create task."
      );
    }
  };

  // =====================================================
  // START EDIT TASK
  // =====================================================

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);

    setEditTaskTitle(task.title);

    setEditTaskDescription(
      task.description || ""
    );

    setEditTaskStatus(
      task.status || "To Do"
    );

    setEditTaskPriority(
      task.priority || "Medium"
    );

    setEditTaskDueDate(
      task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setEditTaskAssignedTo(
      task.assignedTo?._id || ""
    );

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingTaskId(null);

    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskStatus("To Do");
    setEditTaskPriority("Medium");
    setEditTaskDueDate("");
    setEditTaskAssignedTo("");
  };

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.put(
        `/tasks/${editingTaskId}`,
        {
          title: editTaskTitle,
          description: editTaskDescription,
          status: editTaskStatus,
          priority: editTaskPriority,
          dueDate: editTaskDueDate,
          assignedTo:
            editTaskAssignedTo || undefined,
        }
      );

      setSuccessMessage(
        "Task updated successfully."
      );

      handleCancelEdit();

      await loadData();
    } catch (error) {
      console.log(
        "UPDATE TASK ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to update task."
      );
    }
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.delete(`/tasks/${taskId}`);

      setSuccessMessage(
        "Task deleted successfully."
      );

      if (editingTaskId === taskId) {
        handleCancelEdit();
      }

      await loadData();
    } catch (error) {
      console.log(
        "DELETE TASK ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    }
  };

  // =====================================================
  // GET PROJECT MEMBERS
  // =====================================================

  const getProjectMembers = (projectId) => {
    const project = projects.find(
      (item) => item._id === projectId
    );

    return project?.members || [];
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-success";
    }

    if (status === "In Progress") {
      return "bg-warning text-dark";
    }

    return "bg-secondary";
  };

  // =====================================================
  // PRIORITY BADGE
  // =====================================================

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "bg-danger";
    }

    if (priority === "Medium") {
      return "bg-warning text-dark";
    }

    return "bg-info text-dark";
  };

  // =====================================================
  // FILTER TASKS
  // =====================================================

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||
      task.description
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading tasks...
        </p>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="container mt-4 pb-5">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            Tasks
          </h2>

          <p className="text-muted mb-0">
            Manage and track tasks across your projects.
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(
              !showCreateForm
            );

            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          + Create Task
        </button>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div className="alert alert-success alert-dismissible">

          {successMessage}

          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setSuccessMessage("")
            }
          ></button>

        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible">

          {errorMessage}

          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setErrorMessage("")
            }
          ></button>

        </div>
      )}

      {/* =================================================
          CREATE TASK FORM
      ================================================= */}

      {showCreateForm && (
        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Create New Task
            </h5>

            <form onSubmit={handleCreateTask}>

              {/* Title */}
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

              {/* Description */}
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

              {/* Project */}
              <div className="mb-3">

                <label className="form-label">
                  Project
                </label>

                <select
                  className="form-select"
                  value={taskProject}
                  onChange={(e) => {
                    setTaskProject(
                      e.target.value
                    );

                    setTaskAssignedTo("");
                  }}
                  required
                >

                  <option value="">
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project._id}
                      value={project._id}
                    >
                      {project.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Status + Priority */}
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

              {/* Due Date */}
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

              {/* Assigned Member */}
              <div className="mb-3">

                <label className="form-label">
                  Assign To
                </label>

                <select
                  className="form-select"
                  value={taskAssignedTo}
                  onChange={(e) =>
                    setTaskAssignedTo(
                      e.target.value
                    )
                  }
                  disabled={!taskProject}
                >

                  <option value="">
                    Unassigned
                  </option>

                  {getProjectMembers(
                    taskProject
                  ).map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name} (
                      {member.email})
                    </option>
                  ))}

                </select>

                {!taskProject && (
                  <small className="text-muted">
                    Select a project first.
                  </small>
                )}

              </div>

              {/* Buttons */}
              <button
                type="submit"
                className="btn btn-success"
                disabled={
                  projects.length === 0
                }
              >
                Create Task
              </button>

              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setShowCreateForm(false);

                  setTaskTitle("");
                  setTaskDescription("");
                  setTaskStatus("To Do");
                  setTaskPriority("Medium");
                  setTaskDueDate("");
                  setTaskProject("");
                  setTaskAssignedTo("");
                }}
              >
                Cancel
              </button>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          SEARCH AND FILTER
      ================================================= */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* Search */}
            <div className="col-md-6">

              <label className="form-label">
                Search Tasks
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* Status Filter */}
            <div className="col-md-3">

              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Statuses
                </option>

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

            {/* Priority Filter */}
            <div className="col-md-3">

              <label className="form-label">
                Priority
              </label>

              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Priorities
                </option>

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

        </div>

      </div>

      {/* =================================================
          TASK COUNT
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        <span className="badge bg-secondary fs-6">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1
            ? "Task"
            : "Tasks"}
        </span>

        {(searchTerm ||
          statusFilter !== "All" ||
          priorityFilter !== "All") && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All");
              setPriorityFilter("All");
            }}
          >
            Clear Filters
          </button>
        )}

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {tasks.length === 0 ? (

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <h4>
              No Tasks Yet
            </h4>

            <p className="text-muted">
              Create your first task to start
              managing your project work.
            </p>

            {projects.length === 0 ? (

              <p className="text-danger">
                Create a project first before
                creating a task.
              </p>

            ) : (

              <button
                className="btn btn-primary"
                onClick={() =>
                  setShowCreateForm(true)
                }
              >
                + Create Your First Task
              </button>

            )}

          </div>

        </div>

      ) : filteredTasks.length === 0 ? (

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <h4>
              No Matching Tasks
            </h4>

            <p className="text-muted">
              Try changing your search or filters.
            </p>

            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
            >
              Clear Filters
            </button>

          </div>

        </div>

      ) : (

        /* =================================================
           TASK LIST
        ================================================= */

        <div className="row g-4">

          {filteredTasks.map((task) => (

            <div
              className="col-md-6 col-lg-4"
              key={task._id}
            >

              <div className="card shadow-sm h-100">

                {editingTaskId !== task._id ? (

                  <div className="card-body d-flex flex-column">

                    {/* Title */}
                    <div className="d-flex justify-content-between align-items-start mb-2">

                      <h5 className="card-title mb-0">
                        {task.title}
                      </h5>

                    </div>

                    {/* Badges */}
                    <div className="mb-3">

                      <span
                        className={`badge me-2 ${getStatusClass(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`badge ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-muted">

                      {task.description ||
                        "No description available."}

                    </p>

                    {/* Project */}
                    <p className="small mb-2">

                      <strong>
                        Project:
                      </strong>{" "}

                      {task.projectDetails?.name ||
                        "Unknown Project"}

                    </p>

                    {/* Assigned Member */}
                    <p className="small mb-2">

                      <strong>
                        Assigned To:
                      </strong>{" "}

                      {task.assignedTo?.name ||
                        "Unassigned"}

                    </p>

                    {/* Due Date */}
                    <p className="small mb-3">

                      <strong>
                        Due:
                      </strong>{" "}

                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "Not set"}

                    </p>

                    {/* Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-auto">

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

                  </div>

                ) : (

                  /* =================================================
                     EDIT TASK FORM
                  ================================================= */

                  <div className="card-body">

                    <h5 className="mb-3">
                      Edit Task
                    </h5>

                    <form
                      onSubmit={
                        handleUpdateTask
                      }
                    >

                      {/* Title */}
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

                      {/* Description */}
                      <div className="mb-3">

                        <label className="form-label">
                          Description
                        </label>

                        <textarea
                          className="form-control"
                          rows="3"
                          value={
                            editTaskDescription
                          }
                          onChange={(e) =>
                            setEditTaskDescription(
                              e.target.value
                            )
                          }
                        ></textarea>

                      </div>

                      {/* Status */}
                      <div className="mb-3">

                        <label className="form-label">
                          Status
                        </label>

                        <select
                          className="form-select"
                          value={
                            editTaskStatus
                          }
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

                      {/* Priority */}
                      <div className="mb-3">

                        <label className="form-label">
                          Priority
                        </label>

                        <select
                          className="form-select"
                          value={
                            editTaskPriority
                          }
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

                      {/* Due Date */}
                      <div className="mb-3">

                        <label className="form-label">
                          Due Date
                        </label>

                        <input
                          type="date"
                          className="form-control"
                          value={
                            editTaskDueDate
                          }
                          onChange={(e) =>
                            setEditTaskDueDate(
                              e.target.value
                            )
                          }
                        />

                      </div>

                      {/* Assigned Member */}
                      <div className="mb-3">

                        <label className="form-label">
                          Assign To
                        </label>

                        <select
                          className="form-select"
                          value={
                            editTaskAssignedTo
                          }
                          onChange={(e) =>
                            setEditTaskAssignedTo(
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Unassigned
                          </option>

                          {getProjectMembers(
                            task.project
                          ).map((member) => (
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

                      {/* Buttons */}
                      <button
                        type="submit"
                        className="btn btn-success btn-sm"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary btn-sm ms-2"
                        onClick={
                          handleCancelEdit
                        }
                      >
                        Cancel
                      </button>

                    </form>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Tasks;