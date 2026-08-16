import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  // Desktop: sidebar-ka wuu isku laabmaa (collapsed)
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true",
  );
  // Mobile: sidebar-ka wuxuu u shaqeeyaa sida drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  // Marka screen-ka la weyneeyo, xir drawer-ka mobile-ka
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 992) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className={"app-layout" + (collapsed ? " is-collapsed" : "")}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={toggleSidebar}
      />

      {/* Backdrop-ka mobile-ka */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="main-content">
        <Navbar onToggleSidebar={toggleSidebar} collapsed={collapsed} />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;