import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { suitAPI, rentalAPI } from "../../services/api";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert";

function CustomerBookSuit() {
  const navigate = useNavigate();
  const [suits, setSuits] = useState([]);
  const [loadingSuits, setLoadingSuits] = useState(true);
  const [selectedSuit, setSelectedSuit] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSuits = async () => {
      try {
        const res = await suitAPI.getAvailable();
        const data = res?.data;
        const suitList = Array.isArray(data) ? data : data?.suits || data?.data || [];
        setSuits(suitList);
      } catch (err) {
        console.error("Failed to load suits:", err);
        setError("Failed to load suits.");
      } finally {
        setLoadingSuits(false);
      }
    };

    fetchSuits();
  }, []);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = calculateDays();
  const estimatedTotal = selectedSuit ? days * selectedSuit.dailyRate : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedSuit) {
      setError("Please select a suit to book.");
      return;
    }
    if (days < 1) {
      setError("Return date must be after pickup date.");
      return;
    }

    setSubmitting(true);
    try {
      await rentalAPI.createBooking({
        suit: selectedSuit._id,
        startDate,
        endDate,
        notes,
      });

      setSuccess(`Booking created successfully for ${selectedSuit.name}! Redirecting to your bookings...`);
      setTimeout(() => {
        navigate("/customer-bookings");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Book a Luxury Suit</h3>
        <p className="text-muted small mb-0">Select your preferred bespoke garment from our collection and schedule your rental period.</p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <div className="row g-4">
        {/* Suit Selector List */}
        <div className="col-lg-7">
          <div className="card p-3 p-md-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Available Inventory</h5>
              <span className="small text-muted">{suits.length} pieces available</span>
            </div>
            {loadingSuits ? (
              <Loader text="Loading suits collection..." />
            ) : suits.length === 0 ? (
              <div className="text-center text-muted py-5">
                <div className="fs-1 mb-2">👔</div>
                <h6 className="fw-bold">No suits available right now</h6>
                <p className="small mb-0">Please check back soon as garments return from rental.</p>
              </div>
            ) : (
              <div className="row g-3">
                {suits.map((suit) => {
                  const isAvailable = suit.status === "available";
                  const isSelected = selectedSuit?._id === suit._id;
                  return (
                    <div key={suit._id} className="col-sm-6">
                      <div
                        onClick={() => isAvailable && setSelectedSuit(suit)}
                        className={`card h-100 overflow-hidden cursor-pointer ${
                          isSelected ? "border-primary shadow" : ""
                        } ${!isAvailable ? "opacity-50" : ""}`}
                        style={{
                          borderWidth: isSelected ? "2px" : "1px",
                          borderColor: isSelected ? "var(--brand-primary)" : "var(--border-subtle)",
                          cursor: isAvailable ? "pointer" : "not-allowed",
                        }}
                      >
                        <div style={{ height: "150px" }} className="position-relative overflow-hidden bg-light">
                          <img
                            src={
                              suit.image ||
                              "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60"
                            }
                            alt={suit.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <span
                            className={`badge position-absolute top-0 end-0 m-2 bg-${
                              isAvailable ? "success" : "secondary"
                            }`}
                          >
                            {isAvailable ? "Available" : suit.status}
                          </span>
                        </div>
                        <div className="p-3 d-flex flex-column flex-grow-1">
                          <h6 className="fw-bold mb-1 text-truncate">{suit.name}</h6>
                          <div className="d-flex justify-content-between align-items-center small text-muted mb-3">
                            <span>{suit.category} • Size {suit.size}</span>
                            <span className="fw-bold text-primary">${suit.dailyRate ?? suit.rentalPrice}/day</span>
                          </div>
                          <button
                            type="button"
                            disabled={!isAvailable}
                            className={`btn btn-sm mt-auto w-100 ${
                              isSelected ? "btn-primary" : "btn-outline-primary"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : isAvailable ? "Select Suit" : "Unavailable"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Details */}
        <div className="col-lg-5">
          <div className="card p-3 p-md-4 sticky-top" style={{ top: "90px" }}>
            <h5 className="fw-bold mb-3">Reservation Summary</h5>

            {selectedSuit ? (
              <div className="d-flex align-items-center gap-3 p-3 rounded mb-4 border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                <img
                  src={
                    selectedSuit.image ||
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=60"
                  }
                  alt={selectedSuit.name}
                  style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div className="min-w-0 flex-1">
                  <h6 className="fw-bold mb-0 text-truncate">{selectedSuit.name}</h6>
                  <small className="text-muted">${selectedSuit.dailyRate ?? selectedSuit.rentalPrice}/day • {selectedSuit.color} • Size {selectedSuit.size}</small>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded text-center text-muted small mb-4 border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                👈 Click any suit from the left to begin your reservation.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Pickup / Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Return Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Special Requests or Tailoring Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Fitting preference, event theme..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              {days > 0 && selectedSuit && (
                <div className="p-3 rounded mb-4 border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Rental Duration:</span>
                    <span className="fw-semibold">{days} {days === 1 ? "day" : "days"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Daily Rate:</span>
                    <span>${selectedSuit.dailyRate ?? selectedSuit.rentalPrice}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-baseline">
                    <span className="fw-bold">Estimated Total:</span>
                    <span className="text-primary fs-4 fw-bold">${estimatedTotal}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={submitting || !selectedSuit || days < 1}
              >
                {submitting ? "Processing Reservation..." : "Confirm & Submit Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBookSuit;
