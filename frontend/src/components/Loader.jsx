import React from "react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}

export default Loader;
