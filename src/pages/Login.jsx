import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setUser(response.data.user);

      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">

            <div className="text-center mb-4">
              <h1 className="fw-bold text-primary mb-1">
                NOVA
              </h1>

              <p className="text-muted mb-0">
                Plan. Collaborate. Deliver.
              </p>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">
                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                    }}
                  >
                    <FaLock />
                  </div>

                  <h3 className="fw-bold mb-1">
                    Welcome Back
                  </h3>

                  <p className="text-muted small mb-0">
                    Sign in to continue to your workspace
                  </p>
                </div>

                {errorMessage && (
                  <div
                    className="alert alert-danger small"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleLogin}>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FaEnvelope className="text-muted" />
                      </span>

                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMessage("");
                        }}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FaLock className="text-muted" />
                      </span>

                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMessage("");
                        }}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </button>

                </form>

                <div className="text-center mt-4">
                  <p className="text-muted small mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>

              </div>
            </div>

            <p className="text-center text-muted small mt-4 mb-0">
              © {new Date().getFullYear()} NOVA · Team Productivity Platform
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;