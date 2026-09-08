import { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaUserCircle,
  FaSignOutAlt,
  FaTrashAlt,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);

      await api.delete("/auth/me");

      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete account. Please try again."
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 ${
      isActive ? "active fw-semibold" : ""
    }`;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">

          {/* Brand */}
          <Link
            className="navbar-brand fw-bold fs-4"
            to="/"
          >
            NOVA
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#novaNavbar"
            aria-controls="novaNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="novaNavbar"
          >

            {/* Navigation */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/"
                >
                  <FaHome />
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/projects"
                >
                  <FaFolderOpen />
                  Projects
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={navLinkClass}
                  to="/tasks"
                >
                  <FaTasks />
                  Tasks
                </NavLink>
              </li>

            </ul>

            {/* User Area */}
            {user && (
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3">

                <div className="d-flex align-items-center gap-2 text-white me-lg-2">
                  <FaUserCircle className="fs-5" />

                  <span className="small">
                    Hi, <strong>{user.name}</strong>
                  </span>
                </div>

                <button
                  className="btn btn-light btn-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>

                <button
                  className="btn btn-outline-light btn-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <FaTrashAlt />
                  Delete Account
                </button>

              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Delete Account
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                ></button>
              </div>

              <div className="modal-body p-4">

                <div className="text-center mb-3">
                  <div
                    className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "56px",
                      height: "56px",
                    }}
                  >
                    <FaTrashAlt />
                  </div>
                </div>

                <h6 className="text-center fw-bold">
                  Are you sure?
                </h6>

                <p className="text-center text-muted mb-2">
                  You are about to permanently delete
                  your NOVA account.
                </p>

                <p className="text-danger text-center small fw-semibold mb-0">
                  This action cannot be undone.
                </p>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrashAlt />
                      Yes, Delete Account
                    </>
                  )}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;