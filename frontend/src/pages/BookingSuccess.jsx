import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaCalendarCheck, FaReceipt, FaArrowRight } from "react-icons/fa";

function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container mt-5 text-center" style={{ maxWidth: 500 }}>
        <div className="alert alert-warning border-0 mb-3">No booking session found.</div>
        <Link to="/" className="btn btn-primary">Return to Collection</Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: 640 }}>
      <div className="card p-4 p-md-5 text-center shadow-lg border-0">
        <div className="mb-3 d-inline-flex align-items-center justify-content-center">
          <FaCheckCircle
            size={72}
            className="text-success"
            style={{ filter: "drop-shadow(0 0 16px rgba(16, 185, 129, 0.4))" }}
          />
        </div>
        
        <h3 className="fw-bold mb-2">Reservation Confirmed!</h3>
        <p className="text-muted small mb-4">
          Your bespoke suit reservation has been recorded into our system. Our atelier team will have your garment prepped for fitting.
        </p>
        
        <div className="p-3 p-md-4 rounded text-start mb-4 border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
          <div className="d-flex align-items-center gap-2 pb-2 mb-3 border-bottom">
            <FaReceipt className="text-primary" />
            <h6 className="fw-bold mb-0">Booking Summary</h6>
          </div>
          <div className="row g-2 small">
            <div className="col-12">
              <span className="text-muted">Booking Reference: </span>
              <code className="text-primary">{booking._id}</code>
            </div>
            <div className="col-12">
              <span className="text-muted">Garment: </span>
              <strong>{booking.suit?.name || "Luxury Suit"}</strong>
            </div>
            <div className="col-12">
              <span className="text-muted">Rental Schedule: </span>
              <strong>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</strong>
            </div>
            <div className="col-12">
              <span className="text-muted">Total Settled / Estimated: </span>
              <strong className="text-primary fs-6">${booking.totalAmount}</strong>
            </div>
            <div className="col-12">
              <span className="text-muted">Status: </span>
              <span className="badge bg-success ms-1">{booking.rentalStatus || "Reserved"}</span>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          {(() => {
            let role = null;
            try {
              role = JSON.parse(localStorage.getItem("user") || "null")?.role;
            } catch {
              role = null;
            }
            const dashboardPath = role === "customer" ? "/customer-dashboard" : role ? "/dashboard" : "/login";
            return (
              <Link to={dashboardPath} className="btn btn-primary py-2 d-flex align-items-center justify-content-center gap-2">
                Go to Dashboard <FaArrowRight size={13} />
              </Link>
            );
          })()}
          <Link to="/" className="btn btn-outline-secondary py-2">Return to Homepage</Link>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
