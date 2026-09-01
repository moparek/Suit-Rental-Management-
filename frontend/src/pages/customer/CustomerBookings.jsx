import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { rentalAPI } from "../../services/api";
import Loader from "../../components/Loader";
import { FaCalendarAlt, FaTag, FaPlus } from "react-icons/fa";

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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">My Reservations</h3>
          <p className="text-muted small mb-0">Overview of all your past and active suit bookings.</p>
        </div>
        <Link to="/customer-book" className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus size={13} /> Book Another Suit
        </Link>
      </div>

      {loading ? (
        <Loader text="Loading your reservations..." />
      ) : bookings.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          <div className="fs-1 mb-2">📋</div>
          <h5 className="fw-bold">No bookings found</h5>
          <p className="small mb-3">You haven't made any reservations yet.</p>
          <Link to="/customer-book" className="btn btn-primary btn-sm mx-auto" style={{ width: "fit-content" }}>
            Explore Suit Collection
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-12 col-lg-6">
              <div className="card h-100 overflow-hidden d-flex flex-column flex-sm-row">
                <div
                  style={{ width: "100%", smWidth: "160px", maxWidth: "100%", minHeight: "180px" }}
                  className="position-relative flex-shrink-0 d-flex align-items-center justify-content-center bg-light"
                >
                  <img
                    src={
                      booking.suit?.image ||
                      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={booking.suit?.name || "Suit"}
                    style={{ width: "100%", height: "100%", minHeight: "180px", objectFit: "cover" }}
                  />
                </div>
                <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-0">{booking.suit?.name || "Bespoke Garment"}</h5>
                      <span className="small text-muted">{booking.suit?.category || "Formal"} • Size {booking.suit?.size || "-"}</span>
                    </div>
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

                  <div className="small text-muted d-flex align-items-center gap-2 mb-2 mt-2">
                    <FaCalendarAlt size={12} className="text-primary" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()} –{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="small text-muted d-flex align-items-center gap-2 mb-3">
                    <FaTag size={12} className="text-primary" />
                    <span>Daily Rate: ${booking.suit?.dailyRate || booking.suit?.rentalPrice || 0}/day</span>
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Total Cost</span>
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
