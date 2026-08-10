import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus, FaPhoneAlt } from "react-icons/fa";

const PAGE_SIZE = 8;

const statusColor = {
  Reserved: "warning",
  Confirmed: "success",
  Cancelled: "danger",
};

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bookingAPI.getAll();
      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async () => {
    try {
      await bookingAPI.delete(deleteId);
      setSuccess("Booking deleted successfully");
      setDeleteId(null);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete booking");
      setDeleteId(null);
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.includes(search) ||
      b.suit?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Bookings</h3>
          <p className="text-muted small mb-0 d-flex align-items-center gap-1">
            <FaPhoneAlt size={12} /> Internal only — record a booking taken over
            the phone or in person
          </p>
        </div>
        <Link
          to="/bookings/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus /> New Booking
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
          placeholder="Search by customer name, phone, or suit..."
        />
      </div>

      {loading ? (
        <Loader text="Loading bookings..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          No bookings found.
        </div>
      ) : (
        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Suit</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={b._id}>
                    <td>{b.customerName}</td>
                    <td>{b.phone}</td>
                    <td>{b.suit?.name || "-"}</td>
                    <td>{b.size}</td>
                    <td>${b.price}</td>
                    <td>
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge bg-${statusColor[b.status] || "secondary"}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/bookings/edit/${b._id}`}
                        className="btn btn-sm btn-outline-primary me-1"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(b._id)}
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
        title="Delete Booking"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        Are you sure you want to delete this booking? This action cannot be
        undone.
      </Modal>
    </div>
  );
}

export default BookingList;
