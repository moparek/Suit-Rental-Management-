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
    fetchSuit();
  }, [id]);

  const fetchSuit = async () => {
    try {
      const res = await suitAPI.getOne(id);
      setSuit(res.data);
    } catch (err) {
      setError("Suit not found or error loading suit.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!suit) return <div className="container mt-5 text-center alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      <Link to="/" className="btn btn-outline-secondary mb-4">&larr; Back to Suits</Link>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-0">
               {suit.image ? (
                 <img src={suit.image} alt={suit.name} style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
               ) : (
                 <div className="bg-light text-center py-5 h-100 d-flex flex-column justify-content-center">
                   <i className="bi bi-image display-1 text-muted"></i>
                   <p className="mt-3">No image available</p>
                 </div>
               )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title fw-bold">{suit.name}</h2>
              <h4 className="text-primary mb-4">${suit.dailyRate} / day</h4>
              
              <div className="row mb-4">
                <div className="col-6">
                  <p className="mb-1 text-muted">Category</p>
                  <p className="fw-bold">{suit.category}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1 text-muted">Status</p>
                  <p className="fw-bold text-success">
                    {suit.status === "available" ? "Available" : "Unavailable"}
                  </p>
                </div>
                <div className="col-6">
                  <p className="mb-1 text-muted">Size</p>
                  <p className="fw-bold">{suit.size}</p>
                </div>
                <div className="col-6">
                  <p className="mb-1 text-muted">Color</p>
                  <p className="fw-bold">{suit.color}</p>
                </div>
              </div>
              
              <hr />

              {suit.status !== "available" ? (
                <div className="alert alert-warning">
                  This suit is currently unavailable for booking.
                </div>
              ) : (
                <form onSubmit={handleBook}>
                  <h5 className="mb-3">Book this suit</h5>
                  
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label">Start Date</label>
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
                      <label className="form-label">End Date</label>
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
                    <div className="bg-light p-3 rounded mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Duration:</span>
                        <strong>{days} {days === 1 ? 'day' : 'days'}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Price per day:</span>
                        <strong>${suit.dailyRate}</strong>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between">
                        <span className="fs-5">Estimated Total:</span>
                        <strong className="fs-5 text-primary">${estimatedTotal}</strong>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 fs-5"
                    disabled={submitting || days < 1}
                  >
                    {submitting ? "Processing..." : "Confirm Booking"}
                  </button>
                  
                  {!localStorage.getItem("token") && (
                    <div className="text-center mt-3 text-muted small">
                      You will be asked to log in or register on the next step.
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
