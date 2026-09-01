import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rentalAPI, customerAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus, FaUndoAlt } from "react-icons/fa";

const PAGE_SIZE = 8;

function paymentBadgeClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid") return "success";
  if (normalized === "partial") return "secondary";
  return "danger";
}

function formatPaymentStatus(status) {
  if (!status) return "Pending";
  const normalized = String(status).toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

// How many days between two date strings — shown as the rental duration
function daysBetween(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function isHiddenFromList(rental) {
  const status = rental.status || rental.rentalStatus || "";
  const normalized = String(status).toLowerCase();
  return normalized === "returned" || normalized === "cancelled";
}

function RentalList() {
  const [rentals, setRentals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [returnId, setReturnId] = useState(null);

  const fetchRentals = async () => {
    setLoading(true);
    setError("");
    try {
      const [rentalsRes, customersRes] = await Promise.all([
        rentalAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setRentals(rentalsRes.data.rentals || rentalsRes.data || []);
      setCustomers(customersRes.data.customers || customersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  // Look up the customer's ID by their reference on the rental record.
  const getCustomerId = (customerRef) => {
    const id = customerRef?._id || customerRef;
    const match = customers.find((c) => c._id === id);
    const customer = match || customerRef;
    if (!customer?.idType) return "-";
    return customer.idType === "passport" ? "Passport" : "National ID";
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleDelete = async () => {
    try {
      await rentalAPI.delete(deleteId);
      setSuccess("Rental deleted successfully");
      setDeleteId(null);
      fetchRentals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete rental");
      setDeleteId(null);
    }
  };

  const handleReturn = async () => {
    try {
      await rentalAPI.returnRental(returnId);
      setSuccess("Suit returned successfully.");
      setReturnId(null);
      fetchRentals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to return rental");
      setReturnId(null);
    }
  };

  const filtered = rentals
    .filter((r) => !isHiddenFromList(r))
    .filter(
      (r) =>
        r.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        r.suit?.name?.toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Rental Ledger</h3>
          <p className="text-muted small mb-0">Track active rentals, calculate durations, and record returns.</p>
        </div>
        <Link
          to="/rentals/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus size={13} /> New Rental
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
          placeholder="Search by customer name, ID, or suit name..."
        />
      </div>

      {loading ? (
        <Loader text="Loading rental ledger..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          <div className="mb-2 fs-2">👔</div>
          <h5 className="fw-bold">No active rentals found</h5>
          <p className="small mb-0">Try changing your search terms or create a new rental.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-nowrap">
                  <th>Customer</th>
                  <th>ID Verification</th>
                  <th>Suit Rented</th>
                  <th>Duration</th>
                  <th>Rental Dates</th>
                  <th>Rental Status</th>
                  <th>Payment</th>
                  <th>Handled By</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="fw-semibold">{r.customer?.fullName || r.customer?.name || "-"}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {getCustomerId(r.customer)}
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold text-primary">{r.suit?.name || "-"}</span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {daysBetween(r.rentalDate, r.returnDate) ?? "-"} days
                      </span>
                    </td>
                    <td className="small text-muted text-nowrap">
                      {r.rentalDate ? new Date(r.rentalDate).toLocaleDateString() : "-"}
                      {" → "}
                      {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "-"}
                    </td>
                    <td>
                      {(() => {
                        const st = (r.status || r.rentalStatus || "").toLowerCase();
                        const colors = { pending: "warning", accepted: "info", rejected: "danger", active: "primary", returned: "success", overdue: "dark", cancelled: "secondary" };
                        return <span className={`badge bg-${colors[st] || "secondary"}`}>{st.charAt(0).toUpperCase() + st.slice(1)}</span>;
                      })()}
                    </td>
                    <td>
                      <span
                        className={`badge bg-${paymentBadgeClass(r.paymentStatus)}`}
                      >
                        {formatPaymentStatus(r.paymentStatus)}
                      </span>
                    </td>
                    <td>
                      {r.handledBy?.name ? (
                        <span className="badge bg-secondary text-truncate" style={{ maxWidth: "120px" }}>
                          {r.handledBy.name}
                        </span>
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td className="text-end text-nowrap">
                      {(() => {
                        const st = (r.status || r.rentalStatus || "").toLowerCase();
                        return (st === "active" || st === "overdue") ? (
                          <button
                            className="btn btn-sm btn-outline-success me-1 d-inline-flex align-items-center gap-1"
                            onClick={() => setReturnId(r._id)}
                            title="Return Suit"
                          >
                            <FaUndoAlt size={11} /> Return
                          </button>
                        ) : null;
                      })()}
                      <Link
                        to={`/rentals/edit/${r._id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit rental record"
                      >
                        <FaEdit size={12} />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(r._id)}
                        title="Delete rental record"
                      >
                        <FaTrash size={12} />
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
        title="Delete Rental"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        Are you sure you want to delete this rental record? This action cannot
        be undone.
      </Modal>

      <Modal
        show={!!returnId}
        title="Return Suit"
        onClose={() => setReturnId(null)}
        onConfirm={handleReturn}
        confirmText="Return"
      >
        Are you sure you want to mark this suit as returned? The suit will become available again.
      </Modal>
    </div>
  );
}

export default RentalList;
