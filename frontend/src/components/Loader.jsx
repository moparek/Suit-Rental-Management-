import React from "react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-4">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "2.75rem", height: "2.75rem", borderWidth: "3px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold small letter-spacing-wide mb-0">{text}</p>
    </div>
  );
}

export default Loader;
