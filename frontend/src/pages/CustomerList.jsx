import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customerAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus, FaHistory } from "react-icons/fa";

const PAGE_SIZE = 8;

function formatCustomerId(customer) {
  if (!customer?.idType) return "-";
  return customer.idType === "passport" ? "Passport" : "National ID";
}

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // Customer History modal state
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customerAPI.getAll();
      setCustomers(res.data.customers || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch complete customer history when history icon button is clicked
  useEffect(() => {
    if (!historyCustomer) {
      setHistoryDetails(null);
      return;
    }
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await customerAPI.getHistory(historyCustomer._id);
        setHistoryDetails(res.data);
      } catch (err) {
        console.error("Failed to load customer history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [historyCustomer]);

  const handleDelete = async () => {
    try {
      await customerAPI.delete(deleteId);
      setSuccess("Customer deleted successfully");
      setDeleteId(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete customer");
      setDeleteId(null);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      formatCustomerId(c).toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Customers</h3>
        <Link
          to="/customers/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus /> Add Customer
        </Link>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="card p-3 mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or phone..."
        />
      </div>

      {loading ? (
        <Loader text="Loading customers..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          No customers found.
        </div>
      ) : (
        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="text-nowrap">
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>ID</th>
                  <th>Address</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={c._id}>
                    <td>{c.fullName}</td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td><code>{formatCustomerId(c)}</code></td>
                    <td>{c.address}</td>
                    <td className="text-end text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => setHistoryCustomer(c)}
                        title="View full customer information & rental history"
                      >
                        <FaHistory />
                      </button>
                      <Link
                        to={`/customers/edit/${c._id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(c._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        show={!!deleteId}
        title="Delete Customer"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        Are you sure you want to delete this customer? This action cannot be
        undone.
      </Modal>

      {/* Full Customer Information & History Modal */}
      <Modal
        show={!!historyCustomer}
        title={`Customer Details & History — ${historyCustomer?.fullName || historyCustomer?.name || ""}`}
        onClose={() => setHistoryCustomer(null)}
      >
        {historyLoading ? (
          <Loader text="Loading full customer information..." />
        ) : (
          <div>
            {/* Customer Summary */}
            <div className="bg-light p-3 rounded mb-4 border">
              <div className="row g-2">
                <div className="col-sm-6">
                  <strong>Full Name:</strong> {historyCustomer?.fullName || historyCustomer?.name}
                </div>
                <div className="col-sm-6">
                  <strong>Phone:</strong> {historyCustomer?.phone || "-"}
                </div>
                <div className="col-sm-6">
                  <strong>Email:</strong> {historyCustomer?.email || "-"}
                </div>
                <div className="col-sm-6">
                  <strong>ID Type:</strong> {formatCustomerId(historyCustomer)}
                </div>
                <div className="col-12">
                  <strong>Address:</strong> {historyCustomer?.address || "-"}
                </div>
              </div>
            </div>

            {/* Rentals History */}
            <h6 className="fw-bold mb-2">Rentals History</h6>
            {!historyDetails?.rentals || historyDetails.rentals.length === 0 ? (
              <p className="text-muted small mb-4">No rental records for this customer.</p>
            ) : (
              <div className="table-responsive mb-4">
                <table className="table table-sm table-bordered align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Suit</th>
                      <th>Rental Date</th>
                      <th>Return Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyDetails.rentals.map((r) => {
                      const st = (r.status || r.rentalStatus || "").toLowerCase();
                      const statusColors = {
                        active: "primary",
                        returned: "success",
                        overdue: "dark",
                        cancelled: "secondary",
                        accepted: "info",
                        pending: "warning",
                      };
                      return (
                        <tr key={r._id}>
                          <td>{r.suit?.name || "-"}</td>
                          <td>
                            {r.startDate
                              ? new Date(r.startDate).toLocaleDateString()
                              : r.rentalDate
                                ? new Date(r.rentalDate).toLocaleDateString()
                                : "-"}
                          </td>
                          <td>
                            {r.endDate
                              ? new Date(r.endDate).toLocaleDateString()
                              : r.returnDate
                                ? new Date(r.returnDate).toLocaleDateString()
                                : "-"}
                          </td>
                          <td className="fw-bold">${r.totalAmount || 0}</td>
                          <td>
                            <span className={`badge bg-${statusColors[st] || "secondary"}`}>
                              {st ? st.charAt(0).toUpperCase() + st.slice(1) : "-"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${
                                r.paymentStatus === "paid"
                                  ? "success"
                                  : r.paymentStatus === "partial"
                                    ? "secondary"
                                    : "danger"
                              }`}
                            >
                              {r.paymentStatus
                                ? r.paymentStatus.charAt(0).toUpperCase() +
                                  r.paymentStatus.slice(1)
                                : "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bookings History */}
            <h6 className="fw-bold mb-2">Bookings History</h6>
            {!historyDetails?.bookings || historyDetails.bookings.length === 0 ? (
              <p className="text-muted small mb-0">No booking records for this customer.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-bordered align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Suit</th>
                      <th>Booking Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyDetails.bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.suit?.name || b.suitName || "-"}</td>
                        <td>
                          {b.bookingDate
                            ? new Date(b.bookingDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="fw-bold">${b.price || b.totalAmount || 0}</td>
                        <td>
                          <span className="badge bg-info">
                            {b.status
                              ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
                              : "Reserved"}
                          </span>
                        </td>
                        <td>{b.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CustomerList;
