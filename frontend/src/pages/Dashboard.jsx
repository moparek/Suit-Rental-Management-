import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardAPI, rentalAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import {
  FaTshirt,
  FaCheckCircle,
  FaClipboardList,
  FaUsers,
  FaUserTie,
  FaDollarSign,
  FaUndo,
  FaBoxOpen,
} from "react-icons/fa";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="stat-icon" style={{ color }}>
          {icon}
        </div>
        <div>
          <h4 className="mb-0">{value}</h4>
          <small className="text-muted">{label}</small>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState(null);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, rentalsRes] = await Promise.all([
          dashboardAPI.getStats(),
          rentalAPI.getAll({ limit: 5, sort: "-createdAt" }),
        ]);
        setStats(statsRes.data);
        const rentalData = rentalsRes.data?.rentals || rentalsRes.data;
        setRecentRentals(Array.isArray(rentalData) ? rentalData.slice(0, 5) : []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div>
      <h3 className="mb-4 fw-bold">Dashboard</h3>
      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}

      <div className="row">
        <StatCard
          icon={<FaTshirt />}
          label="Total Suits"
          value={stats?.totalSuits ?? 0}
          color="#4361ee"
        />
        <StatCard
          icon={<FaBoxOpen />}
          label="Available Suits"
          value={stats?.availableSuits ?? 0}
          color="#2ec4b6"
        />
        <StatCard
          icon={<FaClipboardList />}
          label="Rented Suits"
          value={stats?.rentedSuits ?? 0}
          color="#ff9f1c"
        />
        <StatCard
          icon={<FaUsers />}
          label="Customers"
          value={stats?.totalCustomers ?? 0}
          color="#e63946"
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="Active Rentals"
          value={stats?.activeRentals ?? 0}
          color="#3a86ff"
        />
        <StatCard
          icon={<FaUndo />}
          label="Returned Rentals"
          value={stats?.returnedRentals ?? 0}
          color="#8338ec"
        />
        {user.role === "admin" && (
          <StatCard
            icon={<FaUserTie />}
            label="Staff"
            value={stats?.totalStaff ?? 0}
            color="#fb5607"
          />
        )}
        <StatCard
          icon={<FaDollarSign />}
          label="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
          color="#06d6a0"
        />
      </div>

      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recent Rentals</h5>
          <Link to="/rentals" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        {recentRentals.length === 0 ? (
          <p className="text-muted mb-0">No recent rentals found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Suit</th>
                  <th>Rental Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRentals.map((r) => (
                  <tr key={r._id}>
                    <td>{r.customer?.fullName || r.customer?.name || "-"}</td>
                    <td>{r.suit?.name || "-"}</td>
                    <td>
                      {r.startDate || r.rentalDate
                        ? new Date(r.startDate || r.rentalDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {r.endDate || r.returnDate
                        ? new Date(r.endDate || r.returnDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {(() => {
                        const st = String(r.status || r.rentalStatus || "").toLowerCase();
                        const colors = {
                          pending: "warning",
                          accepted: "info",
                          rejected: "danger",
                          active: "primary",
                          returned: "success",
                          overdue: "dark",
                          cancelled: "secondary",
                        };
                        const label = st ? st.charAt(0).toUpperCase() + st.slice(1) : "Active";
                        return <span className={`badge bg-${colors[st] || "secondary"}`}>{label}</span>;
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-3">
        <h5 className="mb-3">Quick Actions</h5>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/suits/add" className="btn btn-primary">
            Add Suit
          </Link>
          <Link to="/customers/add" className="btn btn-secondary">
            Add Customer
          </Link>
          <Link to="/bookings/add" className="btn btn-warning">
            New Booking
          </Link>
          <Link to="/rentals/add" className="btn btn-success">
            New Rental
          </Link>
          {user.role === "admin" && (
            <Link to="/staff" className="btn btn-dark">
              Manage Staff
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
