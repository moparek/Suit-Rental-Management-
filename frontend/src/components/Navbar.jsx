import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaBars, FaSun, FaMoon } from "react-icons/fa";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="topbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <div className="d-flex align-items-center gap-2 gap-md-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-lg-none p-2 border-0"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          title="Toggle Navigation"
        >
          <FaBars size={18} />
        </button>
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5 d-none d-sm-inline">👔</span>
          <h5 className="mb-0 fw-bold fs-6 fs-sm-5 text-truncate topbar-brand">
            Hargeisa Suits
          </h5>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {/* Theme Switcher Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <FaSun className="text-warning" />
          ) : (
            <FaMoon className="text-primary" />
          )}
        </button>

        {user?.name && (
          <div className="user-pill d-none d-sm-inline-flex">
            <FaUserCircle className="text-muted" size={16} />
            <span className="text-truncate" style={{ maxWidth: "140px" }}>
              {user.name}
            </span>
            <span className="user-role-badge">{user.role || "Staff"}</span>
          </div>
        )}

        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
