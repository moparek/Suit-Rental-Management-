import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className="app-layout">
      {mobileOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar mobileOpen={mobileOpen} onClose={closeMobileSidebar} />
      <div className="main-content">
        <Navbar onToggleSidebar={toggleMobileSidebar} />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
