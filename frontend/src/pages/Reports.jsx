import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaChartBar, FaDollarSign, FaTshirt, FaUsers } from "react-icons/fa";

function ReportCard({ icon, title, value }) {
  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="stat-card">
        <div className="stat-icon" style={{ color: "#4361ee" }}>
          {icon}
        </div>
        <div>
          <h4 className="mb-0">{value}</h4>
          <small className="text-muted">{title}</small>
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardAPI.getStats();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Generating reports..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">Dashboard Reports</h3>
      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}

      <div className="row">
        <ReportCard
          icon={<FaDollarSign />}
          title="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
        />
        <ReportCard
          icon={<FaTshirt />}
          title="Suits Rented This Month"
          value={stats?.rentedSuits ?? 0}
        />
        <ReportCard
          icon={<FaUsers />}
          title="New Customers This Month"
          value={stats?.newCustomers ?? 0}
        />
        <ReportCard
          icon={<FaChartBar />}
          title="Utilization Rate"
          value={`${stats?.utilizationRate ?? 0}%`}
        />
      </div>

      <div className="card p-4 text-center text-muted">
        Connect chart data from the backend API to visualize revenue and rental
        trends here.
      </div>
    </div>
  );
}

export default Reports;
