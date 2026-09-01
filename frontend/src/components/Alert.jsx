import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

const iconMap = {
  success: <FaCheckCircle className="flex-shrink-0" size={18} />,
  danger: <FaTimesCircle className="flex-shrink-0" size={18} />,
  warning: <FaExclamationTriangle className="flex-shrink-0" size={18} />,
  info: <FaInfoCircle className="flex-shrink-0" size={18} />,
};

// type: "success" | "danger" | "warning" | "info"
function Alert({ type = "info", message, onClose }) {
  if (!message) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm border-0`}
      role="alert"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      {iconMap[type] || iconMap.info}
      <div className="flex-grow-1 small fw-medium">{message}</div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
          style={{ padding: "0.9rem" }}
        />
      )}
    </div>
  );
}

export default Alert;
