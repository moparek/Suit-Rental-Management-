import React, { useState } from "react";
import CustomerSidebar from "./CustomerSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function CustomerLayout({ children }) {
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
      <CustomerSidebar mobileOpen={mobileOpen} onClose={closeMobileSidebar} />
      <div className="main-content">
        <Navbar onToggleSidebar={toggleMobileSidebar} />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default CustomerLayout;
