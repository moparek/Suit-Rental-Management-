import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaUserCircle,
  FaTshirt
} from "react-icons/fa";

const links = [
  { to: "/customer-dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/customer-bookings", label: "My Bookings", icon: <FaBookOpen /> },
  { to: "/customer-profile", label: "Profile", icon: <FaUserCircle /> },
  { to: "/", label: "Book a Suit", icon: <FaTshirt /> },
];

function CustomerSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">👔 Suit Rental</div>
      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
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
