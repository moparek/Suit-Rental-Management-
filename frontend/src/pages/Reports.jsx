import React, { useEffect, useMemo, useState } from "react";
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

const RANGE_OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
  { id: "custom", label: "Custom Range" },
];

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(preset, customStart, customEnd) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  switch (preset) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week": {
      start.setHours(0, 0, 0, 0);
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diff);
      break;
    }
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case "custom":
      if (!customStart || !customEnd) return null;
      return { startDate: customStart, endDate: customEnd };
    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
  }

  return { startDate: formatDateInput(start), endDate: formatDateInput(end) };
}

function ReportCard({ icon, title, value, color = "var(--brand-primary)" }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3 mb-3 mb-md-4">
      <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div
          className="stat-icon"
          style={{
            color,
            backgroundColor: "var(--bg-surface-subtle)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="stat-value">{value}</div>
          <div className="stat-label">{title}</div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="col-lg-6 mb-4">
      <div className="card p-3 p-md-4 h-100">
        <div className="mb-3 mb-md-4">
          <h5 className="fw-bold mb-1">{title}</h5>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        {children}
      </div>
    </div>
  );
}

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rangePreset, setRangePreset] = useState("month");
  const [customStart, setCustomStart] = useState(formatDateInput(new Date()));
  const [customEnd, setCustomEnd] = useState(formatDateInput(new Date()));

  const dateRange = useMemo(
    () => getDateRange(rangePreset, customStart, customEnd),
    [rangePreset, customStart, customEnd],
  );

  useEffect(() => {
    if (!dateRange) return;

    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await dashboardAPI.getStats(dateRange);
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [dateRange]);

  const monthlyRevenue = stats?.monthlyRevenue ?? [];
  const monthlyRentals = stats?.monthlyRentals ?? [];
  const rentalsByCategory = stats?.rentalsByCategory ?? [];

  const hasChartData =
    monthlyRevenue.some((item) => item.revenue > 0) ||
    monthlyRentals.some((item) => item.count > 0) ||
    rentalsByCategory.length > 0;

  const rangeLabel = RANGE_OPTIONS.find((option) => option.id === rangePreset)?.label;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard Reports</h3>
          {dateRange && (
            <small className="text-muted">
              Showing data for {rangeLabel}
              {rangePreset === "custom"
                ? `: ${dateRange.startDate} to ${dateRange.endDate}`
                : ""}
            </small>
          )}
        </div>

        <div className="card p-3">
          <div className="d-flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`btn btn-sm ${rangePreset === option.id ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setRangePreset(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {rangePreset === "custom" && (
            <div className="d-flex flex-wrap gap-3 mt-3 align-items-end">
              <div>
                <label className="form-label mb-1 small text-muted">From</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={customStart}
                  max={customEnd}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label mb-1 small text-muted">To</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={customEnd}
                  min={customStart}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}

      {loading ? (
        <Loader text="Generating reports..." />
      ) : (
        <>
          <div className="row">
            <ReportCard
              icon={<FaDollarSign />}
              title="Total Revenue"
              value={`$${stats?.totalRevenue ?? 0}`}
            />
            <ReportCard
              icon={<FaTshirt />}
              title="Suits Rented"
              value={stats?.rentedSuits ?? 0}
            />
            <ReportCard
              icon={<FaUsers />}
              title="New Customers"
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
              No rental data for the selected period.
            </div>
          ) : (
            <div className="row">
              <ChartCard title="Revenue Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#4361ee" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Rental Trends">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRentals}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
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
        </>
      )}
    </div>
  );
}

export default Reports;
