import React from "react";

function Footer() {
  return (
    <footer className="footer text-center d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
      <div>
        &copy; {new Date().getFullYear()} <strong className="text-primary">Hargeisa Suits</strong>. Luxury Rental Management System.
      </div>
      <div className="small text-muted">
        Crafted for Bespoke Excellence
      </div>
    </footer>
  );
}

export default Footer;
