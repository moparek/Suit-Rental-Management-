import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";

function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="topbar d-flex align-items-center justify-content-between px-3 px-md-4">
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-lg-none p-1 border-0"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          title="Toggle Navigation"
        >
          <FaBars size={20} />
        </button>
        <h5 className="mb-0 fw-bold fs-6 fs-sm-5 text-truncate">Hargeisa Suits</h5>
      </div>
      <div className="d-flex align-items-center gap-2 gap-sm-3">
        {user?.name && (
          <span className="d-none d-sm-inline small text-muted text-truncate" style={{ maxWidth: "180px" }}>
            <FaUserCircle className="me-1" /> {user.name} ({user.role})
          </span>
        )}
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> <span className="d-none d-xs-inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
