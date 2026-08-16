import React from "react";
import CustomerSidebar from "./CustomerSidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function CustomerLayout({ children }) {
  return (
    <div className="app-layout">
      <CustomerSidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
        <Footer />
      </div>
    </div>
  );
}

export default CustomerLayout;
