import React from "react";
import { Link, useLocation } from "react-router-dom";

function BookingSuccess() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">No booking information found.</div>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body text-center p-5">
              <i className="bi bi-check-circle text-success" style={{ fontSize: "5rem" }}></i>
              <h2 className="mt-4 mb-3 fw-bold">Booking Successful!</h2>
              <p className="lead text-muted mb-4">Your suit has been reserved.</p>
              
              <div className="bg-light rounded p-4 text-start mb-4">
                <h5 className="border-bottom pb-2 mb-3">Booking Details</h5>
                <p className="mb-2"><strong>Booking ID:</strong> {booking._id}</p>
                <p className="mb-2"><strong>Suit:</strong> {booking.suit?.name}</p>
                <p className="mb-2"><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                <p className="mb-2"><strong>Total Amount:</strong> <span className="text-primary fw-bold">${booking.totalAmount}</span></p>
                <p className="mb-0"><strong>Status:</strong> <span className="badge bg-info text-dark">{booking.rentalStatus}</span></p>
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
                    <Link to={dashboardPath} className="btn btn-primary btn-lg">Go to Dashboard</Link>
                  );
                })()}
                <Link to="/" className="btn btn-outline-secondary">Return Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
