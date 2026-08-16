import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="topbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h5 className="mb-0 fw-bold topbar-title">Suit Rental Management</h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;