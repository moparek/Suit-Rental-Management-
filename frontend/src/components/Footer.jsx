import React from "react";

function Footer() {
  return (
    <footer className="footer text-center text-muted py-3">
      &copy; {new Date().getFullYear()} Suit Rental Management System. All
      rights reserved.
    </footer>
  );
}

export default Footer;
