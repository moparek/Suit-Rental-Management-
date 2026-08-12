import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { FaChartBar, FaDollarSign, FaTshirt, FaUsers } from "react-icons/fa";

const CHART_COLORS = ["#4361ee", "#2ec4b6", "#ff9f1c", "#e63946", "#8338ec", "#06d6a0"];

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

function ChartCard({ title, children }) {
  return (
    <div className="col-lg-6 mb-4">
      <div className="card p-4 h-100">
        <h5 className="fw-semibold mb-4">{title}</h5>
        {children}
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

  const monthlyRevenue = stats?.monthlyRevenue ?? [];
  const monthlyRentals = stats?.monthlyRentals ?? [];
  const rentalsByCategory = stats?.rentalsByCategory ?? [];

  const hasChartData =
    monthlyRevenue.some((item) => item.revenue > 0) ||
    monthlyRentals.some((item) => item.count > 0) ||
    rentalsByCategory.length > 0;

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

      {!hasChartData ? (
        <div className="card p-4 text-center text-muted">
          No rental data yet. Charts will appear once rentals are recorded.
        </div>
      ) : (
        <div className="row">
          <ChartCard title="Monthly Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#4361ee" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Rental Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRentals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [value, "Rentals"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Rentals"
                  stroke="#2ec4b6"
                  strokeWidth={2}
                  dot={{ fill: "#2ec4b6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {rentalsByCategory.length > 0 && (
            <ChartCard title="Rentals by Category">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rentalsByCategory}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {rentalsByCategory.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;
