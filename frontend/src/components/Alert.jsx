import React from "react";

// type: "success" | "danger" | "warning" | "info"
function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose}></button>
      )}
    </div>
  );
}

export default Alert;
