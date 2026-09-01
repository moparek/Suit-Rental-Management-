import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaLocationDot,
  FaCrown,
  FaSun,
  FaMoon,
  FaCheck,
  FaShieldHalved,
  FaArrowRight,
} from "react-icons/fa6";
import { authAPI } from "../services/api";
import Alert from "../components/Alert";
import showcaseSuitImg from "../assets/blackTie-suit.jpg";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
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
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.phone) errs.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(form.phone))
      errs.phone = "Invalid phone number";
    if (!form.address) errs.address = "Address is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.register(form);
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
        err.response?.data?.message || "Registration failed. Please try again."
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
                <FaShieldHalved /> VIP Membership & Rentals
              </div>
              <h3 className="showcase-hero-heading">
                Step Into <span>Unrivaled Distinction.</span>
              </h3>
              <p className="showcase-description">
                Join our esteemed clientele to reserve premium black-tie
                tuxedos, tailored wedding suits, and executive formalwear with
                complimentary fitting and dry cleaning.
              </p>

              <ul className="showcase-features-list">
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Direct reservations for exclusive suit collections</span>
                </li>
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Personalized measurement and fitting archive</span>
                </li>
                <li className="showcase-feature-item">
                  <span className="showcase-feature-bullet">
                    <FaCheck />
                  </span>
                  <span>Real-time booking tracking & rental management</span>
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

        {/* Right Side: Registration Form */}
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
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-subtitle">
              Join Hargeisa Suits to reserve your bespoke formalwear.
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
            <div className="register-form-grid">
              {/* Full Name Field */}
              <div className="luxury-input-group full-span">
                <label className="luxury-input-label">Full Name</label>
                <div className="luxury-input-wrapper">
                  <FaUser className="luxury-input-icon" />
                  <input
                    type="text"
                    className={`luxury-input-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. Alexander Wright"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <div className="luxury-field-error">{errors.name}</div>
                )}
              </div>

              {/* Email Address Field */}
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <div className="luxury-field-error">{errors.email}</div>
                )}
              </div>

              {/* Phone Field */}
              <div className="luxury-input-group">
                <label className="luxury-input-label">Phone Number</label>
                <div className="luxury-input-wrapper">
                  <FaPhone className="luxury-input-icon" />
                  <input
                    type="tel"
                    className={`luxury-input-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. +252 63 4000000"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && (
                  <div className="luxury-field-error">{errors.phone}</div>
                )}
              </div>

              {/* Address Field */}
              <div className="luxury-input-group full-span">
                <label className="luxury-input-label">Address / Location</label>
                <div className="luxury-input-wrapper">
                  <FaLocationDot className="luxury-input-icon" />
                  <input
                    type="text"
                    className={`luxury-input-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. Main Street, Downtown, Hargeisa"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    autoComplete="street-address"
                  />
                </div>
                {errors.address && (
                  <div className="luxury-field-error">{errors.address}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="luxury-input-group full-span">
                <label className="luxury-input-label">Password</label>
                <div className="luxury-input-wrapper">
                  <FaLock className="luxury-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`luxury-input-control has-toggle ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="luxury-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div className="luxury-field-error">{errors.password}</div>
                )}
              </div>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="auth-switch-prompt">
            Already have an account?
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="auth-switch-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
