import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFolderOpen,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaArrowRight,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const projectResponse = await api.get("/projects");

        const projectList =
          projectResponse.data.projects || [];

        setProjects(projectList);

        let allTasks = [];

        for (const project of projectList) {
          try {
            const taskResponse = await api.get(
              `/tasks/project/${project._id}`
            );

            const projectTasks =
              taskResponse.data.tasks || [];

            allTasks = [
              ...allTasks,
              ...projectTasks.map((task) => ({
                ...task,
                projectName: project.name,
                projectId: project._id,
              })),
            ];
          } catch (error) {
            console.log(
              `TASK FETCH ERROR FOR PROJECT ${project._id}:`,
              error.response?.data
            );
          }
        }

        setTasks(allTasks);
      } catch (error) {
        console.log(
          "DASHBOARD ERROR:",
          error.response?.data
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =====================================================
  // DASHBOARD CALCULATIONS
  // =====================================================

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100
        );

  // =====================================================
  // RECENT PROJECTS
  // =====================================================

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [projects]);

  // =====================================================
  // RECENT TASKS
  // =====================================================

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5);
  }, [tasks]);

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
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (
    <div className="container py-4 pb-5">

      {/* =================================================
          WELCOME HERO
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4 overflow-hidden">
        <div className="card-body p-4 p-md-5">

          <div className="row align-items-center">

            <div className="col-lg-8">

              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary">
                  Workspace
                </span>

                <span className="text-muted small">
                  NOVA Project Management
                </span>
              </div>

              <h1 className="fw-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-muted mb-4">
                Stay organized, manage your projects,
                and keep your team moving forward.
              </p>

              <div className="d-flex flex-wrap gap-2">

                <Link
                  to="/projects"
                  className="btn btn-primary"
                >
                  <FaPlus className="me-2" />
                  New Project
                </Link>

                <Link
                  to="/tasks"
                  className="btn btn-outline-primary"
                >
                  <FaTasks className="me-2" />
                  Manage Tasks
                </Link>

              </div>

            </div>

            <div className="col-lg-4 d-none d-lg-flex justify-content-center">

              <div
                className="text-primary opacity-25"
                style={{ fontSize: "110px" }}
              >
                <FaRocket />
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {errorMessage && (
        <div
          className="alert alert-danger d-flex align-items-center mb-4"
          role="alert"
        >
          <div>
            <strong>Something went wrong.</strong>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="row g-3 g-md-4 mb-4">

        {/* Total Projects */}
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    Total Projects
                  </p>

                  <h2 className="fw-bold mb-0">
                    {projects.length}
                  </h2>
                </div>

                <div className="text-primary fs-3">
                  <FaFolderOpen />
                </div>

              </div>

              <Link
                to="/projects"
                className="small text-decoration-none mt-3 d-inline-block"
              >
                View projects →
              </Link>

            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    Total Tasks
                  </p>

                  <h2 className="fw-bold mb-0">
                    {tasks.length}
                  </h2>
                </div>

                <div className="text-primary fs-3">
                  <FaTasks />
                </div>

              </div>

              <Link
                to="/tasks"
                className="small text-decoration-none mt-3 d-inline-block"
              >
                View tasks →
              </Link>

            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    Completed
                  </p>

                  <h2 className="fw-bold mb-0">
                    {completedTasks}
                  </h2>
                </div>

                <div className="text-success fs-3">
                  <FaCheckCircle />
                </div>

              </div>

              <span className="small text-muted mt-3 d-inline-block">
                Tasks completed
              </span>

            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-md-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <p className="text-muted small mb-2">
                    Pending
                  </p>

                  <h2 className="fw-bold mb-0">
                    {pendingTasks}
                  </h2>
                </div>

                <div className="text-warning fs-3">
                  <FaClock />
                </div>

              </div>

              <span className="small text-muted mt-3 d-inline-block">
                Tasks remaining
              </span>

            </div>
          </div>
        </div>

      </div>

      {/* =================================================
          PROGRESS + QUICK ACTIONS
      ================================================= */}

      <div className="row g-4 mb-4">

        {/* Progress */}
        <div className="col-lg-7">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <FaChartLine className="text-primary" />

                    <h5 className="mb-0 fw-semibold">
                      Overall Progress
                    </h5>
                  </div>

                  <p className="text-muted small mt-2 mb-0">
                    Completion across all your tasks
                  </p>
                </div>

                <div className="text-end">
                  <h3 className="fw-bold text-primary mb-0">
                    {completionPercentage}%
                  </h3>
                </div>

              </div>

              <div
                className="progress"
                style={{ height: "12px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                  aria-valuenow={completionPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="d-flex justify-content-between mt-3">

                <small className="text-muted">
                  {completedTasks} completed
                </small>

                <small className="text-muted">
                  {pendingTasks} remaining
                </small>

              </div>

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="col-lg-5">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body p-4">

              <h5 className="fw-semibold mb-1">
                Quick Actions
              </h5>

              <p className="text-muted small mb-3">
                Jump straight into your workspace.
              </p>

              <div className="d-grid gap-2">

                <Link
                  to="/projects"
                  className="btn btn-outline-primary text-start py-2"
                >
                  <FaPlus className="me-2" />
                  Create or Manage Projects
                </Link>

                <Link
                  to="/tasks"
                  className="btn btn-outline-success text-start py-2"
                >
                  <FaPlus className="me-2" />
                  Create or Manage Tasks
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          RECENT PROJECTS
      ================================================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h5 className="fw-semibold mb-1">
                Recent Projects
              </h5>

              <p className="text-muted small mb-0">
                Your latest project activity
              </p>
            </div>

            <Link
              to="/projects"
              className="btn btn-sm btn-outline-primary"
            >
              View All
              <FaArrowRight className="ms-2" />
            </Link>

          </div>

          {recentProjects.length === 0 ? (

            <div className="text-center py-5">

              <div className="text-muted fs-1 mb-3">
                <FaFolderOpen />
              </div>

              <h6 className="fw-semibold">
                No projects yet
              </h6>

              <p className="text-muted small mb-3">
                Create your first project to get started.
              </p>

              <Link
                to="/projects"
                className="btn btn-primary btn-sm"
              >
                <FaPlus className="me-2" />
                Create Project
              </Link>

            </div>

          ) : (

            <div className="list-group list-group-flush">

              {recentProjects.map((project) => (

                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="list-group-item list-group-item-action px-0 py-3"
                >

                  <div className="row align-items-center g-2">

                    <div className="col-md-8">

                      <h6 className="fw-semibold mb-1">
                        {project.name}
                      </h6>

                      <small className="text-muted">
                        {project.description ||
                          "No description available."}
                      </small>

                    </div>

                    <div className="col-md-4 text-md-end">

                      <span
                        className={`badge ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          RECENT TASKS
      ================================================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h5 className="fw-semibold mb-1">
                Recent Tasks
              </h5>

              <p className="text-muted small mb-0">
                Latest tasks across your projects
              </p>
            </div>

            <Link
              to="/tasks"
              className="btn btn-sm btn-outline-primary"
            >
              View All
              <FaArrowRight className="ms-2" />
            </Link>

          </div>

          {recentTasks.length === 0 ? (

            <div className="text-center py-5">

              <div className="text-muted fs-1 mb-3">
                <FaTasks />
              </div>

              <h6 className="fw-semibold">
                No tasks yet
              </h6>

              <p className="text-muted small mb-3">
                Create a task to start tracking your work.
              </p>

              <Link
                to="/tasks"
                className="btn btn-primary btn-sm"
              >
                <FaPlus className="me-2" />
                Create Task
              </Link>

            </div>

          ) : (

            <div className="list-group list-group-flush">

              {recentTasks.map((task) => (

                <div
                  key={task._id}
                  className="list-group-item px-0 py-3"
                >

                  <div className="row align-items-center g-3">

                    <div className="col-md-7">

                      <h6 className="fw-semibold mb-1">
                        {task.title}
                      </h6>

                      <small className="text-muted">
                        {task.projectName}
                      </small>

                      <div className="mt-2">

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

                    </div>

                    <div className="col-md-5 text-md-end">

                      <small className="text-muted d-block mb-1">
                        Due date
                      </small>

                      <span className="fw-semibold">
                        {task.dueDate
                          ? new Date(
                              task.dueDate
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;