import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Projects() {
  // =====================================================
  // PROJECT STATE
  // =====================================================

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CREATE PROJECT STATE
  // =====================================================

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] =
    useState("");
  const [projectStatus, setProjectStatus] =
    useState("Not Started");
  const [projectStartDate, setProjectStartDate] =
    useState("");
  const [projectDueDate, setProjectDueDate] =
    useState("");

  // =====================================================
  // EDIT PROJECT STATE
  // =====================================================

  const [editingProjectId, setEditingProjectId] =
    useState(null);

  const [editProjectName, setEditProjectName] =
    useState("");
  const [editProjectDescription, setEditProjectDescription] =
    useState("");
  const [editProjectStatus, setEditProjectStatus] =
    useState("Not Started");
  const [editProjectStartDate, setEditProjectStartDate] =
    useState("");
  const [editProjectDueDate, setEditProjectDueDate] =
    useState("");

  // =====================================================
  // MESSAGE STATE
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
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/projects");

      setProjects(response.data.projects || []);
    } catch (error) {
      console.log(
        "FETCH PROJECTS ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =====================================================
  // CREATE PROJECT
  // =====================================================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.post("/projects", {
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        startDate: projectStartDate,
        dueDate: projectDueDate,
      });

      setSuccessMessage(
        "Project created successfully."
      );

      setProjectName("");
      setProjectDescription("");
      setProjectStatus("Not Started");
      setProjectStartDate("");
      setProjectDueDate("");

      setShowCreateForm(false);

      await fetchProjects();
    } catch (error) {
      console.log(
        "CREATE PROJECT ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to create project."
      );
    }
  };

  // =====================================================
  // START EDIT PROJECT
  // =====================================================

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);

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

    setSuccessMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingProjectId(null);

    setEditProjectName("");
    setEditProjectDescription("");
    setEditProjectStatus("Not Started");
    setEditProjectStartDate("");
    setEditProjectDueDate("");
  };

  // =====================================================
  // UPDATE PROJECT
  // =====================================================

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.put(
        `/projects/${editingProjectId}`,
        {
          name: editProjectName,
          description: editProjectDescription,
          status: editProjectStatus,
          startDate: editProjectStartDate,
          dueDate: editProjectDueDate,
        }
      );

      setSuccessMessage(
        "Project updated successfully."
      );

      handleCancelEdit();

      await fetchProjects();
    } catch (error) {
      console.log(
        "UPDATE PROJECT ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to update project."
      );
    }
  };

  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.delete(`/projects/${projectId}`);

      setSuccessMessage(
        "Project deleted successfully."
      );

      if (editingProjectId === projectId) {
        handleCancelEdit();
      }

      await fetchProjects();
    } catch (error) {
      console.log(
        "DELETE PROJECT ERROR:",
        error.response?.data
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to delete project."
      );
    }
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
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3">
          Loading projects...
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
          PAGE HEADER
      ================================================= */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h2 className="mb-1">
            Projects
          </h2>

          <p className="text-muted mb-0">
            Create, manage and track your NOVA projects.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(!showCreateForm);

            setSuccessMessage("");
            setErrorMessage("");
          }}
        >
          + Create Project
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
          CREATE PROJECT FORM
      ================================================= */}

      {showCreateForm && (
        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <h5 className="mb-3">
              Create New Project
            </h5>

            <form onSubmit={handleCreateProject}>

              <div className="mb-3">
                <label className="form-label">
                  Project Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
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
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) =>
                    setProjectDescription(
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
                  value={projectStatus}
                  onChange={(e) =>
                    setProjectStatus(e.target.value)
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
                    value={projectStartDate}
                    onChange={(e) =>
                      setProjectStartDate(
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
                    value={projectDueDate}
                    onChange={(e) =>
                      setProjectDueDate(
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
                  Create Project
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);

                    setProjectName("");
                    setProjectDescription("");
                    setProjectStatus("Not Started");
                    setProjectStartDate("");
                    setProjectDueDate("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          PROJECT COUNT
      ================================================= */}

      <div className="mb-3">

        <span className="badge bg-secondary fs-6">
          {projects.length}{" "}
          {projects.length === 1
            ? "Project"
            : "Projects"}
        </span>

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {projects.length === 0 ? (

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <h4>
              No Projects Yet
            </h4>

            <p className="text-muted">
              Create your first NOVA project
              to start managing tasks and
              collaborating with your team.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                setShowCreateForm(true)
              }
            >
              + Create Your First Project
            </button>

          </div>

        </div>

      ) : (

        <div className="row g-4">

          {projects.map((project) => (

            <div
              className="col-md-6 col-lg-4"
              key={project._id}
            >

              <div className="card shadow-sm h-100">

                {editingProjectId !==
                project._id ? (

                  <div className="card-body d-flex flex-column">

                    {/* Title + Status */}
                    <div className="d-flex justify-content-between align-items-start mb-3">

                      <h5 className="card-title mb-0">
                        {project.name}
                      </h5>

                      <span
                        className={`badge ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-muted">
                      {project.description ||
                        "No description available."}
                    </p>

                    {/* Dates */}
                    <div className="small mb-3">

                      <p className="mb-1">
                        <strong>
                          Start:
                        </strong>{" "}

                        {project.startDate
                          ? new Date(
                              project.startDate
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>

                      <p className="mb-0">
                        <strong>
                          Due:
                        </strong>{" "}

                        {project.dueDate
                          ? new Date(
                              project.dueDate
                            ).toLocaleDateString()
                          : "Not set"}
                      </p>

                    </div>

                    {/* Members */}
                    <div className="mb-3">

                      <span className="text-muted small">
                        👥{" "}
                        {project.members?.length ||
                          0}{" "}
                        team members
                      </span>

                    </div>

                    {/* Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-auto">

                      <Link
                        to={`/projects/${project._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          handleEditProject(project)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleDeleteProject(
                            project._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ) : (

                  <div className="card-body">

                    <h5 className="mb-3">
                      Edit Project
                    </h5>

                    <form
                      onSubmit={
                        handleUpdateProject
                      }
                    >

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
                          value={
                            editProjectDescription
                          }
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
                          value={
                            editProjectStatus
                          }
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

                        <div className="col-6 mb-3">

                          <label className="form-label">
                            Start Date
                          </label>

                          <input
                            type="date"
                            className="form-control"
                            value={
                              editProjectStartDate
                            }
                            onChange={(e) =>
                              setEditProjectStartDate(
                                e.target.value
                              )
                            }
                          />

                        </div>

                        <div className="col-6 mb-3">

                          <label className="form-label">
                            Due Date
                          </label>

                          <input
                            type="date"
                            className="form-control"
                            value={
                              editProjectDueDate
                            }
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
                          className="btn btn-success btn-sm"
                        >
                          Save Changes
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={
                            handleCancelEdit
                          }
                        >
                          Cancel
                        </button>

                      </div>

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

export default Projects;