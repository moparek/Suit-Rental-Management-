import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaUserCircle,
  FaTshirt,
  FaTimes,
  FaCrown,
} from "react-icons/fa";

const links = [
  { to: "/customer-dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/customer-book", label: "Book a Suit", icon: <FaTshirt /> },
  { to: "/customer-bookings", label: "My Bookings", icon: <FaBookOpen /> },
  { to: "/customer-profile", label: "My Profile", icon: <FaUserCircle /> },
];

function CustomerSidebar({ mobileOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand-wrapper">
        <Link to="/customer-dashboard" className="sidebar-brand-link" onClick={onClose}>
          <div className="sidebar-brand-icon">
            <FaCrown size={18} />
          </div>
          <div>
            <div className="sidebar-brand-title">Hargeisa Suits</div>
            <div className="sidebar-brand-badge">Client Portal</div>
          </div>
        </Link>
        <button
          type="button"
          className="sidebar-close-btn d-lg-none"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <FaTimes />
        </button>
      </div>

      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer-card">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white font-monospace"
            style={{ width: "32px", height: "32px", fontSize: "0.8rem", fontWeight: "bold" }}
          >
            {(user.name || "C").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="small fw-bold text-truncate text-white" style={{ fontSize: "0.82rem" }}>
              {user.name || "Valued Client"}
            </div>
            <div className="text-muted small text-capitalize" style={{ fontSize: "0.72rem" }}>
              Customer Account
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CustomerSidebar;
