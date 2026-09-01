import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTshirt,
  FaUsers,
  FaClipboardList,
  FaUserTie,
  FaUserCircle,
  FaChartBar,
  FaPhoneAlt,
  FaTimes,
  FaCrown,
} from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt />, group: "Overview" },
  { to: "/suits", label: "Suits Catalog", icon: <FaTshirt />, group: "Inventory" },
  { to: "/customers", label: "Customers", icon: <FaUsers />, group: "Operations" },
  { to: "/booking-management", label: "Bookings", icon: <FaClipboardList />, group: "Operations" },
  { to: "/rentals", label: "Rentals", icon: <FaPhoneAlt />, group: "Operations" },
  { to: "/staff", label: "Staff", icon: <FaUserTie />, group: "Administration" },
  { to: "/reports", label: "Analytics & Reports", icon: <FaChartBar />, group: "Administration" },
  { to: "/profile", label: "My Profile", icon: <FaUserCircle />, group: "Account" },
];

function Sidebar({ mobileOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const visibleLinks = links.filter(
    (link) => link.to !== "/staff" || user.role === "admin",
  );

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand-wrapper">
        <Link to="/dashboard" className="sidebar-brand-link" onClick={onClose}>
          <div className="sidebar-brand-icon">
            <FaCrown size={18} />
          </div>
          <div>
            <div className="sidebar-brand-title">Hargeisa Suits</div>
            <div className="sidebar-brand-badge">Luxury Atelier</div>
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
        {visibleLinks.map((link) => (
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
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="small fw-bold text-truncate text-white" style={{ fontSize: "0.82rem" }}>
              {user.name || "Staff Member"}
            </div>
            <div className="text-muted small text-capitalize" style={{ fontSize: "0.72rem" }}>
              {user.role || "User"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
