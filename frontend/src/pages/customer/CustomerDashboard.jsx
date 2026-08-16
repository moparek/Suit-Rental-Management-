import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { rentalAPI } from "../../services/api";

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
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(b => {
    const st = (b.status || b.rentalStatus || "").toLowerCase();
    return st === "pending" || st === "accepted" || st === "active";
  }).length;
  const totalBookings = bookings.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Link to="/" className="btn btn-primary">Book a Suit</Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-primary h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Welcome Back</h5>
              <h2 className="display-6 fw-bold mb-0 mt-3">{user.name}</h2>
              <p className="mt-2 text-white-50">Have a great day!</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-success h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title">Active Bookings</h5>
              <h2 className="display-4 fw-bold mb-0">{activeBookings}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card text-white bg-info h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title">Total Bookings</h5>
              <h2 className="display-4 fw-bold mb-0">{totalBookings}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 pt-4 pb-0">
          <h4 className="card-title mb-0">Recent Bookings</h4>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-muted">You have no recent bookings.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Suit</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {booking.suit?.image ? (
                            <img src={booking.suit.image} alt={booking.suit.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} className="me-3" />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center text-muted me-3" style={{ width: "40px", height: "40px", borderRadius: "4px" }}>
                              <i className="bi bi-image"></i>
                            </div>
                          )}
                          <span className="fw-medium">{booking.suit?.name || "Unknown Suit"}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td>${booking.totalAmount}</td>
                      <td>
                        {(() => {
                          const st = (booking.status || booking.rentalStatus || "").toLowerCase();
                          const colors = { pending: "warning", accepted: "info", rejected: "danger", active: "primary", returned: "success", overdue: "dark", cancelled: "secondary" };
                          const labels = { pending: "Pending", accepted: "Accepted", rejected: "Rejected", active: "Active", returned: "Returned", overdue: "Overdue", cancelled: "Cancelled" };
                          return <span className={`badge bg-${colors[st] || "secondary"}`}>{labels[st] || st}</span>;
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length > 5 && (
                <div className="text-center mt-3">
                  <Link to="/customer-bookings" className="btn btn-sm btn-outline-primary">View All Bookings</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
