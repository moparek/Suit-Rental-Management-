import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { suitAPI, rentalAPI } from "../services/api";

function PublicBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suit, setSuit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Try to restore from sessionStorage
  const savedState = JSON.parse(sessionStorage.getItem("pendingBooking") || "{}");
  const initialStartDate = savedState.suitId === id ? savedState.startDate : "";
  const initialEndDate = savedState.suitId === id ? savedState.endDate : "";
  
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuit = async () => {
      try {
        const res = await suitAPI.getOne(id);
        setSuit(res.data);
      } catch (err) {
        console.error("Error loading suit:", err);
        setError("Suit not found or error loading suit.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuit();
  }, [id]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const days = calculateDays();
  const estimatedTotal = suit ? days * suit.dailyRate : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (days < 1) {
      setError("End date must be after start date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // Save state and redirect to login
      sessionStorage.setItem("pendingBooking", JSON.stringify({
        suitId: id,
        startDate,
        endDate
      }));
      navigate("/login?redirect=booking");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await rentalAPI.createBooking({
        suit: id,
        startDate,
        endDate,
      });
      // Clear pending booking if successful
      sessionStorage.removeItem("pendingBooking");
      navigate("/booking-success", { state: { booking: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5 text-center"><Loader text="Loading garment details..." /></div>;
  if (!suit) return <div className="container py-5 text-center"><Alert type="danger" message={error || "Suit not found."} /></div>;

  return (
    <div className="container my-4 my-md-5" style={{ maxWidth: "1050px" }}>
      <Link to="/" className="btn btn-outline-secondary mb-4 d-inline-flex align-items-center gap-2">
        &larr; Back to Collection
      </Link>

      <div className="row g-4 g-lg-5">
        <div className="col-md-6">
          <div className="card overflow-hidden h-100 p-0 border-0 shadow-lg position-relative" style={{ borderRadius: "var(--radius-lg)" }}>
            {suit.image ? (
              <img
                src={suit.image}
                alt={suit.name}
                style={{ width: "100%", height: "100%", minHeight: "440px", objectFit: "cover" }}
              />
            ) : (
              <div className="bg-light text-center py-5 h-100 d-flex flex-column justify-content-center">
                <div className="fs-1 mb-2">👔</div>
                <p className="text-muted">No high-res photo available</p>
              </div>
            )}
            <span
              className={`badge position-absolute top-0 end-0 m-3 bg-${
                suit.status === "available" ? "success" : "secondary"
              }`}
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.85rem", backdropFilter: "blur(8px)" }}
            >
              {suit.status === "available" ? "Available for Rent" : "Unavailable"}
            </span>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card p-4 p-md-5">
            <div>
              <div className="small text-muted text-uppercase letter-spacing-wide mb-1">{suit.category} Collection</div>
              <h2 className="fw-bold mb-2">{suit.name}</h2>
              <div className="d-flex align-items-baseline gap-2 mb-4">
                <span className="fs-2 fw-bold text-primary">${suit.dailyRate ?? suit.rentalPrice}</span>
                <span className="text-muted">/ rental day</span>
              </div>
              
              <div className="row g-3 mb-4 p-3 rounded border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                <div className="col-6">
                  <span className="small text-muted d-block">Garment Size</span>
                  <span className="fw-bold">Size {suit.size}</span>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Fabric Color</span>
                  <span className="fw-bold">{suit.color}</span>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Condition</span>
                  <span className="fw-bold">{suit.condition || "Pristine"}</span>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Availability</span>
                  <span className={`fw-bold text-${suit.status === "available" ? "success" : "danger"}`}>
                    {suit.status === "available" ? "Ready Now" : "Rented Out"}
                  </span>
                </div>
              </div>

              {suit.status !== "available" ? (
                <div className="alert alert-warning border-0">
                  This garment is currently rented or being prepped by our atelier.
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  <h5 className="fw-bold mb-3">Schedule Your Fitting & Rental</h5>
                  
                  {error && <Alert type="danger" message={error} onClose={() => setError("")} />}
                  
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label small fw-bold">Pickup Date *</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small fw-bold">Return Date *</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        min={startDate || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {days > 0 && (
                    <div className="p-3 rounded mb-4 border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Duration:</span>
                        <strong>{days} {days === 1 ? 'day' : 'days'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Daily Rate:</span>
                        <strong>${suit.dailyRate ?? suit.rentalPrice}</strong>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between align-items-baseline">
                        <span className="fw-bold">Estimated Total:</span>
                        <strong className="fs-3 text-primary">${estimatedTotal}</strong>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 fw-bold fs-6"
                    disabled={submitting || days < 1}
                  >
                    {submitting ? "Processing..." : "Confirm Reservation"}
                  </button>
                  
                  {!localStorage.getItem("token") && (
                    <div className="text-center mt-3 text-muted small">
                      You will be asked to sign in or create an account on the next step.
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicBooking;
