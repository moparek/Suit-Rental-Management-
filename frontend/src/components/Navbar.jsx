import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="topbar d-flex align-items-center justify-content-between px-4">
      <div>
        <h5 className="mb-0 fw-bold">Hargeisa Suits</h5>
        <small className="text-muted">📍 Dero Mall • 📞 063-409876543 • ✉️ hargiesa@gmail.com</small>
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
