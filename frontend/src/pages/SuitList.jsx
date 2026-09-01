import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { suitAPI, rentalAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const PAGE_SIZE = 8;

// How many days between two date strings — used to show rental duration
function daysBetween(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function SuitList() {
  const [suits, setSuits] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [availability, setAvailability] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSuits = async () => {
    setLoading(true);
    setError("");
    try {
      const [suitsRes, rentalsRes] = await Promise.all([
        suitAPI.getAll(),
        rentalAPI.getAll(),
      ]);
      setSuits(suitsRes.data.suits || suitsRes.data || []);
      setRentals(rentalsRes.data.rentals || rentalsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load suits");
    } finally {
      setLoading(false);
    }
  };

  // For a given suit, find its currently active rental (if any) so the card
  // can show who has it, for how many days, and whether they've paid.
  const getActiveRental = (suitId) =>
    rentals.find((r) => {
      const id = r.suit?._id || r.suit;
      const st = String(r.status || r.rentalStatus || "").toLowerCase();
      return id === suitId && (st === "active" || st === "accepted" || st === "reserved");
    });

  useEffect(() => {
    fetchSuits();
  }, []);

  const handleDelete = async () => {
    try {
      await suitAPI.delete(deleteId);
      setSuccess("Suit deleted successfully");
      setDeleteId(null);
      fetchSuits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete suit");
      setDeleteId(null);
    }
  };

  const filtered = suits.filter((s) => {
    // Hide rented suits from the list
    if (s.status === "rented") return false;

    return (
      s.name?.toLowerCase().includes(search.toLowerCase()) &&
      (category ? s.category === category : true) &&
      (size ? s.size === size : true) &&
      (availability ? String(s.availability) === availability : true)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">Suits</h3>
        <Link
          to="/suits/add"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <FaPlus /> Add Suit
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
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by suit name..."
            />
          </div>
          <div className="col-12 col-sm-4 col-md-3">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Formal">Formal</option>
              <option value="Wedding">Wedding</option>
              <option value="Casual">Casual</option>
              <option value="Tuxedo">Tuxedo</option>
            </select>
          </div>
          <div className="col-12 col-sm-4 col-md-2">
            <select
              className="form-select"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All Sizes</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div className="col-12 col-sm-4 col-md-3">
            <select
              className="form-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">All Availability</option>
              <option value="true">Available</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading luxury inventory..." />
      ) : paginated.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          <div className="mb-2 fs-2">👔</div>
          <h5 className="fw-bold">No suits found</h5>
          <p className="small mb-0">Try changing your search terms or filters.</p>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {paginated.map((suit) => {
            const activeRental = getActiveRental(suit._id);
            const days = activeRental
              ? daysBetween(activeRental.rentalDate, activeRental.returnDate)
              : null;
            return (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={suit._id}>
                <div className="suit-card">
                  <div className="suit-card-img-wrap position-relative">
                    <img
                      src={
                        suit.image ||
                        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60"
                      }
                      alt={suit.name}
                      className="suit-card-img"
                    />
                    <span
                      className={`badge position-absolute top-0 end-0 m-3 bg-${
                        suit.status === "available"
                          ? "success"
                          : suit.status === "reserved"
                          ? "warning"
                          : "secondary"
                      }`}
                      style={{ backdropFilter: "blur(6px)" }}
                    >
                      {suit.status === "available"
                        ? "Available"
                        : suit.status
                        ? suit.status.charAt(0).toUpperCase() + suit.status.slice(1)
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold mb-0 text-truncate">{suit.name}</h6>
                    </div>

                    <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                      <span>{suit.category}</span>
                      <span>•</span>
                      <span>Size {suit.size}</span>
                      <span>•</span>
                      <span>{suit.color}</span>
                    </div>

                    <div className="d-flex align-items-baseline justify-content-between mb-3 mt-auto">
                      <span className="text-muted small">Daily Rate</span>
                      <span className="fs-5 fw-bold text-primary">
                        ${suit.dailyRate ?? suit.rentalPrice}
                        <span className="small text-muted fw-normal"> / day</span>
                      </span>
                    </div>

                    {activeRental && (
                      <div className="reservation-info mb-3">
                        <div className="d-flex align-items-center gap-2 small text-muted mb-1">
                          <FaUser size={11} className="text-primary opacity-75" />
                          <span className="text-truncate">
                            {activeRental.customer?.fullName ||
                              activeRental.customer?.name ||
                              "Unknown customer"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-between small text-muted">
                          <span className="d-flex align-items-center gap-1">
                            <FaCalendarAlt size={11} />
                            {days} day{days === 1 ? "" : "s"}
                          </span>
                          <span
                            className={`badge bg-${
                              activeRental.paymentStatus === "Paid" ? "success" : "danger"
                            }`}
                            style={{ fontSize: "0.68rem" }}
                          >
                            {activeRental.paymentStatus}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2 pt-2 border-top">
                      <Link
                        to={`/suits/edit/${suit._id}`}
                        className="btn btn-sm btn-outline-primary flex-fill"
                      >
                        <FaEdit size={12} /> Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger flex-fill"
                        onClick={() => setDeleteId(suit._id)}
                      >
                        <FaTrash size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        show={!!deleteId}
        title="Delete Suit"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      >
        Are you sure you want to delete this suit from the inventory? This action cannot be undone.
      </Modal>
    </div>
  );
}

export default SuitList;
