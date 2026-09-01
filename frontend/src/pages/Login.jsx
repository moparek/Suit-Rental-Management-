import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCrown,
  FaSun,
  FaMoon,
  FaCheck,
  FaShieldHalved,
  FaArrowRight,
} from "react-icons/fa6";
import { authAPI } from "../services/api";
import Alert from "../components/Alert";
import showcaseSuitImg from "../assets/royal-italian-midnight-tuxedo.jpg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("app-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (redirect === "booking" && sessionStorage.getItem("pendingBooking")) {
        const pending = JSON.parse(sessionStorage.getItem("pendingBooking"));
        navigate(`/suit/${pending.suitId}`);
      } else if (res.data.user.role === "customer") {
        navigate("/customer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-auth-page">
      <div className="luxury-auth-bg-glow-1"></div>
      <div className="luxury-auth-bg-glow-2"></div>

      <div className="luxury-auth-container">
        {/* Left Side: Luxury Brand & Visual Showcase */}
        <div
          className="auth-showcase-panel"
          style={{ backgroundImage: `url(${showcaseSuitImg})` }}
        >
          <div className="auth-showcase-overlay"></div>
          <div className="auth-showcase-content">
            {/* Brand Header */}
            <div className="showcase-brand-header">
              <div className="showcase-brand-icon-wrap">
                <FaCrown />
              </div>
              <div>
                <h2 className="showcase-brand-name">Hargeisa Suits</h2>
                <span className="showcase-brand-tagline">
                  Luxury Rental Experience
                </span>
              </div>
            </div>

            {/* Center Showcase Content */}
            <div className="showcase-center-body">
              <div className="showcase-pill-badge">
                <FaShieldHalved /> Bespoke Formalwear & Tuxedos
              </div>
              <h3 className="showcase-hero-heading">
                Elegance Tailored <span>For Your Moments.</span>
              </h3>
              <p className="showcase-description">
                Experience world-class Italian craftsmanship, midnight velvets,
                and impeccable fitting services for weddings, black-tie galas,
                and executive ceremonies.
              </p>

              <ul className="showcase-features-list">
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Handcrafted wool and silk blends</span>
                </li>
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Complimentary master tailoring & concierge fitting</span>
                </li>
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Seamless online booking & prompt delivery</span>
                </li>
              </ul>
            </div>

            {/* Showcase Footer */}
            <div className="showcase-footer">
              <span>© {new Date().getFullYear()} Hargeisa Suits</span>
              <span>Premium Sartorial Excellence</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="auth-form-panel">
          {/* Top Bar: Back Link & Theme Toggle */}
          <div className="auth-panel-topbar">
            <Link
              to="/"
              className="auth-nav-btn"
              aria-label="Back to landing page"
              title="Back to landing page"
            >
              <FaArrowLeft /> Back to Home
            </Link>

            <button
              type="button"
              className="auth-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Mobile Brand Header (shown when showcase panel is hidden on mobile) */}
          <div className="mobile-auth-brand">
            <div className="mobile-brand-icon">
              <FaCrown />
            </div>
            <div>
              <h3 className="mobile-brand-title">Hargeisa Suits</h3>
              <span className="mobile-brand-sub">Luxury Suit Rental</span>
            </div>
          </div>

          {/* Form Header */}
          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-subtitle">
              Sign in to manage your luxury suit rentals and reservations.
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <Alert
              type="danger"
              message={serverError}
              onClose={() => setServerError("")}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="luxury-input-group">
              <label className="luxury-input-label">Email Address</label>
              <div className="luxury-input-wrapper">
                <FaEnvelope className="luxury-input-icon" />
                <input
                  type="email"
                  className={`luxury-input-control ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="luxury-field-error">{errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="luxury-input-group">
              <label className="luxury-input-label">Password</label>
              <div className="luxury-input-wrapper">
                <FaLock className="luxury-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`luxury-input-control has-toggle ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="luxury-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <div className="luxury-field-error">{errors.password}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="luxury-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="luxury-btn-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <p className="auth-switch-prompt">
            Don't have an account?
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="auth-switch-link"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
