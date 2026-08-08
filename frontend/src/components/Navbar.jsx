import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="topbar d-flex align-items-center justify-content-between px-4">
      <h5 className="mb-0 fw-bold">Suit Rental Management</h5>
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
