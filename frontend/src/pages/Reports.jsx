import React, { useEffect, useMemo, useState } from "react";
import { dashboardAPI, reportAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import { AreaChart, BarChart, DonutChart, PALETTE } from "../components/Charts";
import {
  FaChartBar,
  FaDollarSign,
  FaTshirt,
  FaUsers,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";

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

function ChartCard({ title, icon, action, children }) {
  return (
    <div className="card chart-card mb-4">
      <div className="chart-card-header">
        <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
          {icon} {title}
        </h6>
        {action}
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}

function Reports() {
  const [stats, setStats] = useState(null);
  const [suitReport, setSuitReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("area"); // area | bar
  const [range, setRange] = useState("6"); // 6 | 12

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await dashboardAPI.getStats();
        setStats(res.data);

        // Warbixinta suits-ka waa ikhtiyaari — haddii ay fashilanto bogga ha istaagin
        try {
          const suitsRes = await reportAPI.getSuits();
          setSuitReport(Array.isArray(suitsRes.data) ? suitsRes.data : []);
        } catch {
          setSuitReport([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ---- Dakhliga bilaha ----
  const revenueData = useMemo(() => {
    const monthly = stats?.monthlyRevenue || [];
    const mapped = monthly.map((m) => ({
      label: m.month,
      value: Number(m.revenue) || 0,
    }));
    return range === "6" ? mapped.slice(-6) : mapped;
  }, [stats, range]);

  // ---- Kirooyinka nooc kasta ----
  const categoryData = useMemo(() => {
    const cats = stats?.rentalsByCategory || [];
    return cats.map((c, i) => ({
      label: c.category,
      value: Number(c.count) || 0,
      color: PALETTE[i % PALETTE.length],
    }));
  }, [stats]);

  // ---- Xaaladda kireysiga ----
  const statusData = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Active", value: Number(stats.activeRentals) || 0, color: "#4361ee" },
      { label: "Returned", value: Number(stats.returnedRentals) || 0, color: "#2ec4b6" },
      { label: "Pending Bookings", value: Number(stats.pendingBookings) || 0, color: "#f9a826" },
    ];
  }, [stats]);

  // ---- Suits-ka ugu dakhliga badan ----
  const topSuits = useMemo(() => {
    return [...suitReport]
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 6)
      .map((s, i) => ({
        label: s.suit || "N/A",
        value: Number(s.revenue) || 0,
        color: PALETTE[i % PALETTE.length],
      }));
  }, [suitReport]);

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

      {/* ---------- Row 1: Revenue trend + Categories ---------- */}
      <div className="row">
        <div className="col-lg-8">
          <ChartCard
            title="Revenue Trend"
            icon={<FaChartLine />}
            action={
              <div className="chart-actions">
                <select
                  className="form-select form-select-sm"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option value="6">Last 6 months</option>
                  <option value="12">Full year</option>
                </select>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className={
                      "btn " +
                      (chartType === "area"
                        ? "btn-primary"
                        : "btn-outline-primary")
                    }
                    onClick={() => setChartType("area")}
                  >
                    Line
                  </button>
                  <button
                    type="button"
                    className={
                      "btn " +
                      (chartType === "bar"
                        ? "btn-primary"
                        : "btn-outline-primary")
                    }
                    onClick={() => setChartType("bar")}
                  >
                    Bar
                  </button>
                </div>
              </div>
            }
          >
            {chartType === "area" ? (
              <AreaChart data={revenueData} prefix="$" color="#4361ee" />
            ) : (
              <BarChart data={revenueData} prefix="$" color="#4361ee" />
            )}
          </ChartCard>
        </div>

        <div className="col-lg-4">
          <ChartCard title="Rentals by Category" icon={<FaChartPie />}>
            <DonutChart data={categoryData} centerLabel="Rentals" />
          </ChartCard>
        </div>
      </div>

      {/* ---------- Row 2: Top suits + Rental status ---------- */}
      <div className="row">
        <div className="col-lg-7">
          <ChartCard title="Top Suits by Revenue" icon={<FaTshirt />}>
            <BarChart data={topSuits} prefix="$" />
          </ChartCard>
        </div>

        <div className="col-lg-5">
          <ChartCard title="Rental Status Overview" icon={<FaChartBar />}>
            <DonutChart data={statusData} centerLabel="Records" />
          </ChartCard>
        </div>
      </div>

      {/* ---------- Table: Suit performance ---------- */}
      <div className="card p-3 mb-4">
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <FaTshirt /> Suit Performance
        </h6>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Suit</th>
                <th>Category</th>
                <th>Times Rented</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {suitReport.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No suit data available
                  </td>
                </tr>
              )}
              {suitReport.map((s, i) => (
                <tr key={s._id || i}>
                  <td>{i + 1}</td>
                  <td className="fw-semibold">{s.suit}</td>
                  <td>{s.category}</td>
                  <td>{s.timesRented}</td>
                  <td>${s.revenue}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (s.status === "available"
                          ? "bg-success"
                          : s.status === "rented"
                            ? "bg-primary"
                            : "bg-secondary")
                      }
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;