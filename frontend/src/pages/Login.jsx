import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Alert from "../components/Alert";

// Demo credentials — lets you preview the app before the real backend is connected.
// Remove this block once your teammate's API is live.
const DEMO_EMAIL = "admin@demo.com";
const DEMO_PASSWORD = "demo123";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const loginWithDemoAccount = (credentials) => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Demo Admin",
        email: credentials.email,
        role: "Admin",
      }),
    );
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    // Shortcut: demo credentials skip the API entirely, so the UI works with no backend
    if (form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD) {
      loginWithDemoAccount(form);
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Login failed. No backend connected yet? Use the demo account below to preview the app.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    loginWithDemoAccount({ email: DEMO_EMAIL });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4 fw-bold">Suit Rental Login</h3>
        {serverError && (
          <Alert
            type="danger"
            message={serverError}
            onClose={() => setServerError("")}
          />
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="demo-box mt-4">
          <p className="mb-1 fw-bold small">
            🔑 No backend yet? Use the demo account:
          </p>
          <p className="mb-2 small text-muted">
            Email: <code>{DEMO_EMAIL}</code> &nbsp;|&nbsp; Password:{" "}
            <code>{DEMO_PASSWORD}</code>
          </p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm w-100"
            onClick={handleDemoClick}
          >
            Continue with Demo Account
          </button>
        </div>

        <p className="text-center mt-3 mb-0">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
