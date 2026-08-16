import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTshirt,
  FaUsers,
  FaClipboardList,
  FaUserTie,
  FaUserCircle,
  FaChartBar,
  FaPhoneAlt,
  FaAngleLeft,
  FaAngleRight,
  FaTimes,
} from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/suits", label: "Suits", icon: <FaTshirt /> },
  { to: "/customers", label: "Customers", icon: <FaUsers /> },
  { to: "/bookings", label: "Bookings", icon: <FaPhoneAlt /> },
  { to: "/rentals", label: "Rentals", icon: <FaClipboardList /> },
  { to: "/staff", label: "Staff", icon: <FaUserTie /> },
  { to: "/reports", label: "Reports", icon: <FaChartBar /> },
  { to: "/profile", label: "Profile", icon: <FaUserCircle /> },
];

function Sidebar({ collapsed = false, mobileOpen = false, onClose, onToggle }) {
  return (
    <aside
      className={
        "sidebar" +
        (collapsed ? " collapsed" : "") +
        (mobileOpen ? " mobile-open" : "")
      }
    >
      <div className="sidebar-brand">
        <span className="brand-icon">👔</span>
        <span className="brand-text">Suit Rental</span>

        {/* Batoonka xirista ee mobile-ka */}
        <button
          type="button"
          className="sidebar-close d-lg-none"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              title={link.label}
              onClick={onClose}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Batoonka collapse/expand ee desktop-ka */}
      <button
        type="button"
        className="sidebar-toggle-btn d-none d-lg-flex"
        onClick={onToggle}
        aria-label="Toggle sidebar"
        title={collapsed ? "Expand menu" : "Collapse menu"}
      >
        {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
        <span className="sidebar-label">Collapse</span>
      </button>
    </aside>
  );
}

export default Sidebar;