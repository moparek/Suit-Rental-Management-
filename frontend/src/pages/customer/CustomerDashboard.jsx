import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { rentalAPI } from "../../services/api";
import Loader from "../../components/Loader";
import { FaTshirt, FaCalendarCheck, FaSuitcase, FaArrowRight, FaPlus } from "react-icons/fa";

function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const activeBookings = bookings.filter((b) => {
    const st = (b.status || b.rentalStatus || "").toLowerCase();
    return st === "pending" || st === "accepted" || st === "active";
  }).length;
  const totalBookings = bookings.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Client Dashboard</h3>
          <p className="text-muted small mb-0">
            Welcome back, <strong className="text-primary">{user.name || "Client"}</strong>. View and manage your suit reservations.
          </p>
        </div>
        <Link to="/customer-book" className="btn btn-primary d-flex align-items-center gap-2">
          <FaPlus size={13} /> Book a Suit
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card" style={{ borderLeft: "4px solid var(--brand-primary)" }}>
            <div
              className="stat-icon"
              style={{
                color: "var(--brand-primary)",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <FaSuitcase />
            </div>
            <div className="min-w-0 flex-1">
              <div className="stat-value">{user.name ? user.name.split(" ")[0] : "Client"}</div>
              <div className="stat-label">Active Member</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card" style={{ borderLeft: "4px solid #10b981" }}>
            <div
              className="stat-icon"
              style={{
                color: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <FaCalendarCheck />
            </div>
            <div className="min-w-0 flex-1">
              <div className="stat-value">{activeBookings}</div>
              <div className="stat-label">Active / Ongoing Rentals</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card" style={{ borderLeft: "4px solid #f59e0b" }}>
            <div
              className="stat-icon"
              style={{
                color: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <FaTshirt />
            </div>
            <div className="min-w-0 flex-1">
              <div className="stat-value">{totalBookings}</div>
              <div className="stat-label">Total Reservations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Card */}
      <div className="card p-3 p-md-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-bold">Recent Reservations</h5>
            <small className="text-muted">Your latest suit rentals and event bookings</small>
          </div>
          {bookings.length > 5 && (
            <Link to="/customer-bookings" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
              View All <FaArrowRight size={11} />
            </Link>
          )}
        </div>

        {loading ? (
          <Loader text="Loading your reservations..." />
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="fs-1 mb-2">👔</div>
            <h6 className="fw-bold">No suit bookings found</h6>
            <p className="small mb-3">You haven't reserved any luxury suits yet.</p>
            <Link to="/customer-book" className="btn btn-primary btn-sm">
              Explore Our Collection
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Reserved Suit</th>
                  <th>Rental Period</th>
                  <th>Total Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {booking.suit?.image ? (
                          <img
                            src={booking.suit.image}
                            alt={booking.suit.name}
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid var(--border-subtle)",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center text-muted"
                            style={{ width: "40px", height: "40px", borderRadius: "6px" }}
                          >
                            👔
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{booking.suit?.name || "Bespoke Suit"}</div>
                          <small className="text-muted">{booking.suit?.category || "Formal"} • Size {booking.suit?.size || "-"}</small>
                        </div>
                      </div>
                    </td>
                    <td className="small text-muted">
                      {new Date(booking.startDate).toLocaleDateString()} –{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="fw-bold text-primary">${booking.totalAmount}</span>
                    </td>
                    <td>
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
                          accepted: "Accepted",
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
