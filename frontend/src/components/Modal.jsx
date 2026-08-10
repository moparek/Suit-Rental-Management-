import React from "react";

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
    <div className="modal-backdrop-custom">
      <div className="modal-box">
        <div className="modal-header-custom">
          <h5>{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body-custom">{children}</div>
        <div className="modal-footer-custom">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {onConfirm && (
            <button className="btn btn-danger" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
