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
  FaArrowRight,
  FaPlus,
  FaCalendarAlt,
  FaUserPlus,
} from "react-icons/fa";

function StatCard({ icon, label, value, color, bgSoft }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3 mb-md-4">
      <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div
          className="stat-icon"
          style={{
            color,
            backgroundColor: bgSoft || "var(--bg-surface-subtle)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
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

  if (loading) return <Loader text="Loading dashboard metrics..." />;

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Top Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Executive Dashboard</h3>
          <p className="text-muted small mb-0">
            Welcome back, <strong className="text-primary">{user?.name || "Admin"}</strong>. Here is the operational overview for today.
          </p>
        </div>
        <div className="badge bg-secondary p-2 px-3 d-flex align-items-center gap-2 border">
          <FaCalendarAlt size={13} className="text-primary" />
          <span className="text-muted small">{todayStr}</span>
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}

      {/* KPI Cards Grid */}
      <div className="row g-3 g-md-4 mb-4">
        <StatCard
          icon={<FaTshirt />}
          label="Total Inventory"
          value={stats?.totalSuits ?? 0}
          color="#4f46e5"
          bgSoft="rgba(79, 70, 229, 0.1)"
        />
        <StatCard
          icon={<FaBoxOpen />}
          label="Available Suits"
          value={stats?.availableSuits ?? 0}
          color="#10b981"
          bgSoft="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          icon={<FaClipboardList />}
          label="Rented Suits"
          value={stats?.rentedSuits ?? 0}
          color="#f59e0b"
          bgSoft="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          icon={<FaUsers />}
          label="Total Customers"
          value={stats?.totalCustomers ?? 0}
          color="#0ea5e9"
          bgSoft="rgba(14, 165, 233, 0.1)"
        />
        <StatCard
          icon={<FaCheckCircle />}
          label="Active Rentals"
          value={stats?.activeRentals ?? 0}
          color="#6366f1"
          bgSoft="rgba(99, 102, 241, 0.1)"
        />
        <StatCard
          icon={<FaUndo />}
          label="Returned Suits"
          value={stats?.returnedRentals ?? 0}
          color="#8b5cf6"
          bgSoft="rgba(139, 92, 246, 0.1)"
        />
        {user.role === "admin" && (
          <StatCard
            icon={<FaUserTie />}
            label="Staff Members"
            value={stats?.totalStaff ?? 0}
            color="#ec4899"
            bgSoft="rgba(236, 72, 153, 0.1)"
          />
        )}
        <StatCard
          icon={<FaDollarSign />}
          label="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
          color="#059669"
          bgSoft="rgba(5, 150, 105, 0.1)"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="card p-3 p-md-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Quick Actions</h5>
          <span className="small text-muted">Frequent operations</span>
        </div>
        <div className="d-flex gap-2 gap-md-3 flex-wrap">
          <Link to="/suits/add" className="btn btn-primary">
            <FaPlus size={13} /> Add Suit
          </Link>
          <Link to="/customers/add" className="btn btn-secondary">
            <FaUserPlus size={14} /> Add Customer
          </Link>
          <Link to="/bookings/add" className="btn btn-secondary">
            <FaCalendarAlt size={13} /> New Booking
          </Link>
          <Link to="/rentals/add" className="btn btn-outline-primary">
            <FaPlus size={13} /> New Rental
          </Link>
          {user.role === "admin" && (
            <Link to="/staff" className="btn btn-outline-secondary">
              <FaUserTie size={13} /> Manage Staff
            </Link>
          )}
        </div>
      </div>

      {/* Recent Rentals Table */}
      <div className="card p-3 p-md-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 fw-bold">Recent Rentals</h5>
            <small className="text-muted">Latest rental activity and returns</small>
          </div>
          <Link to="/rentals" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
            View All <FaArrowRight size={11} />
          </Link>
        </div>

        {recentRentals.length === 0 ? (
          <div className="text-center py-4 text-muted small">No recent rentals found.</div>
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
                    <td>
                      <span className="fw-semibold">
                        {r.customer?.fullName || r.customer?.name || "-"}
                      </span>
                    </td>
                    <td>{r.suit?.name || "-"}</td>
                    <td className="text-muted small">
                      {r.startDate || r.rentalDate
                        ? new Date(r.startDate || r.rentalDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="text-muted small">
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
    </div>
  );
}

export default Dashboard;
