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
} from "react-icons/fa";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/suits", label: "Suits", icon: <FaTshirt /> },
  { to: "/customers", label: "Customers", icon: <FaUsers /> },
  { to: "/booking-management", label: "Bookings", icon: <FaClipboardList /> },
  { to: "/rentals", label: "Rentals", icon: <FaPhoneAlt /> },
  { to: "/staff", label: "Staff", icon: <FaUserTie /> },
  { to: "/reports", label: "Reports", icon: <FaChartBar /> },
  { to: "/profile", label: "Profile", icon: <FaUserCircle /> },
];

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const visibleLinks = links.filter(
    (link) => link.to !== "/staff" || user.role === "admin",
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">👔 Hargeisa Suits</div>
      <ul className="sidebar-nav">
        {visibleLinks.map((link) => (
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

export default Sidebar;
