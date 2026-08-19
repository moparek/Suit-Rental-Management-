import React, { useState, useEffect } from "react";
import { rentalAPI } from "../../services/api";

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await rentalAPI.getMyBookings();
      const data = res?.data;
      setBookings(Array.isArray(data) ? data : data?.rentals || data?.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Bookings</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info text-center py-4">
          You haven't made any bookings yet.
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-12 col-lg-6">
              <div className="card shadow-sm h-100 border-0 flex-row overflow-hidden">
                <div style={{ width: "150px", minWidth: "150px" }} className="bg-light d-flex align-items-center justify-content-center">
                  {booking.suit?.image ? (
                    <img src={booking.suit.image} alt={booking.suit.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="bi bi-suit-spade display-4 text-muted"></i>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0">{booking.suit?.name || "Unknown Suit"}</h5>
                    {(() => {
                      const st = (booking.status || booking.rentalStatus || "").toLowerCase();
                      const colors = {
                        pending: "warning",
                        accepted: "info",
                        rejected: "danger",
                        active: "primary",
                        returned: "success",
                        overdue: "dark",
                        cancelled: "secondary",
                      };
                      const labels = {
                        pending: "Pending",
                        accepted: "Accepted / Reserved",
                        rejected: "Rejected",
                        active: "Active",
                        returned: "Returned",
                        overdue: "Overdue",
                        cancelled: "Cancelled",
                      };
                      return (
                        <span className={`badge bg-${colors[st] || "secondary"}`}>
                          {labels[st] || st}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-muted small mb-3">Booking ID: {booking._id}</p>
                  
                  <div className="mb-2">
                    <strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="mb-3">
                    <strong>Price per day:</strong> ${booking.suit?.dailyRate || 0}
                  </div>
                  
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total Amount</span>
                    <span className="fs-5 fw-bold text-primary">${booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerBookings;
