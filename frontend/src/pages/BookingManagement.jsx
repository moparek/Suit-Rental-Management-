import React, { useEffect, useState } from "react";
import { rentalAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import {
  FaCheck,
  FaTimes,
  FaPlay,
} from "react-icons/fa";

const PAGE_SIZE = 8;

const statusBadge = {
  pending: "warning",
  accepted: "info",
  rejected: "danger",
  active: "primary",
  returned: "success",
  overdue: "dark",
  cancelled: "secondary",
};

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function BookingManagement() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionModal, setActionModal] = useState(null);

  const fetchRentals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await rentalAPI.getAll();
      setRentals(res.data.rentals || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleAction = async () => {
    if (!actionModal) return;
    const { id, action } = actionModal;
    setActionModal(null);
    setError("");
    setSuccess("");
    try {
      if (action === "accept") {
        await rentalAPI.accept(id);
        setSuccess("Booking accepted successfully.");
      } else if (action === "reject") {
        await rentalAPI.reject(id);
        setSuccess("Booking rejected.");
      } else if (action === "start") {
        await rentalAPI.startRental(id);
        setSuccess("Rental started. Suit is now rented.");
      } else if (action === "return") {
        await rentalAPI.returnRental(id);
        setSuccess("Suit returned successfully.");
      }
      fetchRentals();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} booking.`);
    }
  };

  const modalMessages = {
    accept: "Accept this booking? The suit will be reserved for the customer.",
    reject: "Reject this booking? The suit will become available again.",
    start: "Start this rental? The customer is receiving the suit now.",
    return: "Return this suit? It will be marked as available again.",
  };

  const filtered = rentals
    .filter((r) => {
      // Exclude manual walk-in rentals created by staff/admin (only display online customer account bookings)
      if (r.isOnlineBooking === false) return false;
      if (
        r.isOnlineBooking === undefined &&
        (r.rentalStatus === "active" ||
          r.rentalStatus === "returned" ||
          r.rentalStatus === "overdue")
      ) {
        return false;
      }

      const st = (r.status || r.rentalStatus || "").toLowerCase();
      if (filterStatus !== "all" && st !== filterStatus) return false;
      const q = search.toLowerCase();
      return (
        !q ||
        r.customer?.name?.toLowerCase().includes(q) ||
        r.customer?.fullName?.toLowerCase().includes(q) ||
        r.customer?.email?.toLowerCase().includes(q) ||
        r.customer?.phone?.includes(q) ||
        r.suit?.name?.toLowerCase().includes(q)
      );
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Booking Management</h3>
          <p className="text-muted small mb-0">Review, accept, reject, start, and return customer bookings.</p>
        </div>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <div className="card p-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-8">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by customer name, email, phone, or suit..."
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold mb-1">Filter by Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading bookings..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">No bookings found.</div>
      ) : (
        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Suit</th>
                  <th>Size / Color</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Handled By</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => {
                  const st = (r.status || r.rentalStatus || "").toLowerCase();
                  const days = daysBetween(r.startDate, r.endDate);
                  return (
                    <tr key={r._id}>
                      <td>
                        <div className="fw-medium">{r.customer?.name || "-"}</div>
                        <small className="text-muted">{r.customer?.email || ""}</small>
                      </td>
                      <td><small>{r.customer?.phone || "-"}</small></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {r.suit?.image && (
                            <img src={r.suit.image} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />
                          )}
                          <span>{r.suit?.name || "-"}</span>
                        </div>
                      </td>
                      <td>
                        <small>{r.suit?.size || "-"} / {r.suit?.color || "-"}</small>
                      </td>
                      <td>
                        <small>
                          {new Date(r.startDate).toLocaleDateString()} –{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td>{days}</td>
                      <td className="fw-bold">${r.totalAmount}</td>
                      <td>
                        <span className={`badge bg-${statusBadge[st] || "secondary"}`}>
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </span>
                      </td>
                      <td>
                        {r.handledBy?.name ? (
                          <span className="badge bg-light text-dark border">
                            {r.handledBy.name} ({r.handledBy.role || "Staff"})
                          </span>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-1 justify-content-end flex-wrap">
                          {st === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                onClick={() => setActionModal({ id: r._id, action: "accept" })}
                                title="Accept Booking"
                              >
                                <FaCheck /> Accept
                              </button>
                              <button
                                className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                onClick={() => setActionModal({ id: r._id, action: "reject" })}
                                title="Reject Booking"
                              >
                                <FaTimes /> Reject
                              </button>
                            </>
                          )}
                          {st === "accepted" && (
                            <button
                              className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                              onClick={() => setActionModal({ id: r._id, action: "start" })}
                              title="Start Rental"
                            >
                              <FaPlay /> Start Rental
                            </button>
                          )}
                          {(st === "active" || st === "overdue" || st === "returned" || st === "rejected" || st === "cancelled") && (
                            <span className="text-muted small">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        show={!!actionModal}
        title={actionModal ? actionModal.action.charAt(0).toUpperCase() + actionModal.action.slice(1) + " Booking" : ""}
        onClose={() => setActionModal(null)}
        onConfirm={handleAction}
        confirmText={actionModal ? actionModal.action.charAt(0).toUpperCase() + actionModal.action.slice(1) : "Confirm"}
      >
        {actionModal ? modalMessages[actionModal.action] : ""}
      </Modal>
    </div>
  );
}

export default BookingManagement;
