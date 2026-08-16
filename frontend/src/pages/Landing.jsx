import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { suitAPI } from "../services/api";

function Landing() {
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuits();
  }, []);

  const fetchSuits = async () => {
    try {
      const res = await suitAPI.getAvailable();
      setSuits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page d-flex flex-column min-vh-100">
      <header className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Premium Suit Rentals</h1>
          <p className="lead">Look your best for any occasion without breaking the bank.</p>
        </div>
      </header>

      <div className="container my-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="mb-0">Available Suits</h2>
          <Link to="/login" className="btn btn-outline-primary">Sign In / Register</Link>
        </div>
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : suits.length === 0 ? (
          <div className="alert alert-info text-center">No suits available at the moment. Please check back later.</div>
        ) : (
          <div className="row g-4">
            {suits.map((suit) => (
              <div key={suit._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow transition-all">
                  <div className="card-img-top bg-light" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {suit.image ? (
                      <img src={suit.image} alt={suit.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="text-center text-muted">
                        <i className="bi bi-suit-spade display-1"></i>
                        <p className="mt-2">No Image</p>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold fs-4">{suit.name}</h5>
                    <p className="text-muted mb-3">{suit.category}</p>
                    
                    <div className="d-flex mb-3 gap-2 flex-wrap">
                      <span className="badge bg-secondary">Size: {suit.size}</span>
                      <span className="badge bg-secondary">Color: {suit.color}</span>
                      <span className="badge bg-success">Available</span>
                    </div>
                    
                    <div className="mt-auto d-flex justify-content-between align-items-center border-top pt-3">
                      <div>
                        <span className="fs-3 fw-bold text-primary">${suit.dailyRate}</span>
                        <span className="text-muted ms-1">/ day</span>
                      </div>
                      <button 
                        className="btn btn-primary px-4 py-2"
                        onClick={() => navigate(`/suit/${suit._id}`)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer className="bg-light py-4 mt-auto">
        <div className="container text-center text-muted">
          <p className="mb-0">&copy; {new Date().getFullYear()} Suit Rental Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
