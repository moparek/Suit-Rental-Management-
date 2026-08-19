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
        <h2 className="fw-bold mb-1">Book a Suit</h2>
        <p className="text-muted">Choose an available suit and pick your rental dates.</p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <div className="row g-4">
        {/* Suit Selector List */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-3 mb-4">
            <h5 className="fw-bold mb-3">Select a Suit</h5>
            {loadingSuits ? (
              <Loader text="Loading suits..." />
            ) : suits.length === 0 ? (
              <div className="text-center text-muted py-4">No suits available right now.</div>
            ) : (
              <div className="row g-3">
                {suits.map((suit) => {
                  const isAvailable = suit.status === "available";
                  const isSelected = selectedSuit?._id === suit._id;
                  return (
                    <div key={suit._id} className="col-sm-6">
                      <div
                        onClick={() => isAvailable && setSelectedSuit(suit)}
                        className={`card h-100 border ${isSelected ? "border-primary border-2 shadow" : "border-light"} ${
                          isAvailable ? "cursor-pointer" : "opacity-50"
                        }`}
                        style={{ cursor: isAvailable ? "pointer" : "not-allowed", transition: "all 0.2s" }}
                      >
                        <div style={{ height: "140px" }} className="bg-light position-relative overflow-hidden">
                          {suit.image ? (
                            <img
                              src={suit.image}
                              alt={suit.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <i className="bi bi-image display-4"></i>
                            </div>
                          )}
                          <span
                            className={`badge position-absolute top-0 end-0 m-2 bg-${
                              isAvailable ? "success" : "secondary"
                            }`}
                          >
                            {isAvailable ? "Available" : suit.status}
                          </span>
                        </div>
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-1">{suit.name}</h6>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">{suit.category} • {suit.size}</small>
                            <span className="fw-bold text-primary">${suit.dailyRate}/day</span>
                          </div>
                          <button
                            type="button"
                            disabled={!isAvailable}
                            className={`btn btn-sm w-100 ${
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
          <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "90px" }}>
            <h5 className="fw-bold mb-3">Booking Details</h5>

            {selectedSuit ? (
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-4">
                {selectedSuit.image && (
                  <img
                    src={selectedSuit.image}
                    alt={selectedSuit.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                  />
                )}
                <div>
                  <h6 className="fw-bold mb-0">{selectedSuit.name}</h6>
                  <small className="text-muted">${selectedSuit.dailyRate}/day • {selectedSuit.color}</small>
                </div>
              </div>
            ) : (
              <div className="alert alert-info text-center py-3 mb-4 small">
                👈 Please click on a suit on the left to select it.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Pickup Date</label>
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
                <label className="form-label small fw-bold text-muted">Return Date</label>
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
                <label className="form-label small fw-bold text-muted">Notes / Special Requests (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Need fitting instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              {days > 0 && selectedSuit && (
                <div className="bg-light p-3 rounded mb-4">
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Duration:</span>
                    <span>{days} {days === 1 ? "day" : "days"}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small text-muted">
                    <span>Daily Rate:</span>
                    <span>${selectedSuit.dailyRate}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Estimated Total:</span>
                    <span className="text-primary fs-5">${estimatedTotal}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={submitting || !selectedSuit || days < 1}
              >
                {submitting ? "Submitting Booking..." : "Submit Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBookSuit;
