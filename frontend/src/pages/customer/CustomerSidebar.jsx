import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaUserCircle,
  FaTshirt,
  FaTimes,
} from "react-icons/fa";

const links = [
  { to: "/customer-dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/customer-bookings", label: "My Bookings", icon: <FaBookOpen /> },
  { to: "/customer-profile", label: "Profile", icon: <FaUserCircle /> },
  { to: "/customer-book", label: "Book a Suit", icon: <FaTshirt /> },
];

function CustomerSidebar({ mobileOpen, onClose }) {
  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand-wrapper">
        <div className="sidebar-brand">👔 Hargeisa Suits</div>
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
    </aside>
  );
}

export default CustomerSidebar;
