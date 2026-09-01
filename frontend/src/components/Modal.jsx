import React from "react";
import { FaTimes } from "react-icons/fa";

function Modal({
  show,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
}) {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop-custom"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-box">
        <div className="modal-header-custom">
          <h5 className="mb-0">{title}</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary p-1 border-0"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <div className="modal-body-custom">{children}</div>
        <div className="modal-footer-custom">
          <button type="button" className="btn btn-secondary px-3" onClick={onClose}>
            Cancel
          </button>
          {onConfirm && (
            <button
              type="button"
              className={`btn ${confirmText.toLowerCase().includes("delete") || confirmText.toLowerCase().includes("remove") || confirmText.toLowerCase().includes("reject") ? "btn-danger" : "btn-primary"} px-4`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
