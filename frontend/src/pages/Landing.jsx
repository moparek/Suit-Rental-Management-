import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { suitAPI } from "../services/api";

function Landing() {
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Wedding",
    "Casual",
    "Formal",
    "Tuxedo",
  ];

  useEffect(() => {
    fetchSuits();
  }, []);

  const fetchSuits = async () => {
    try {
      const res = await suitAPI.getAvailable();
      const data = res?.data;
      // Backend-ku wuxuu soo celin karaa array toos ah, ama object sida
      // { suits: [...] } / { data: [...] }. Labadaba waa la maamulayaa.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.suits)
          ? data.suits
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setSuits(list);
    } catch (err) {
      console.error("Failed to load suits:", err);
      setSuits([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuits = (Array.isArray(suits) ? suits : []).filter((suit) => {
    if (!suit) return false;
    const matchesSearch = (suit.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || suit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="landing-page d-flex flex-column min-vh-100 bg-light">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4 text-primary" to="/">
            <i className="bi bi-suit-spade-fill me-2"></i>Hargeisa Suits
          </Link>
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-muted small d-none d-md-inline">
              📍 Dero Mall | ✉️ hargiesa@gmail.com | 📞 063-409876543
            </span>
            <Link
              to="/login"
              className="btn btn-outline-primary px-4 rounded-pill"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="hero-section text-white text-center py-5"
        style={{
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          padding: "8rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative photos of men in suits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80&auto=format&fit=crop"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "26%",
              objectFit: "cover",
              opacity: 0.22,
              filter: "grayscale(30%) saturate(120%)",
              mixBlendMode: "luminosity",
              maskImage:
                "linear-gradient(to right, black 40%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 40%, transparent 100%)",
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500&q=80&auto=format&fit=crop"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "100%",
              width: "26%",
              objectFit: "cover",
              opacity: 0.22,
              filter: "grayscale(30%) saturate(120%)",
              mixBlendMode: "luminosity",
              maskImage:
                "linear-gradient(to left, black 40%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 40%, transparent 100%)",
            }}
          />
        </div>
        <div
          className="container py-5"
          style={{ position: "relative", zIndex: 1 }}
        >
          <h1
            className="display-4 fw-bolder mb-4"
            style={{ letterSpacing: "-1px" }}
          >
            Find Your Perfect Suit
          </h1>
          <p className="lead mb-5 fw-light" style={{ opacity: 0.9 }}>
            Premium rentals for weddings, business, and formal events. Look your
            absolute best.
          </p>

          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div
                className="input-group input-group-lg shadow-lg"
                style={{ borderRadius: "50px", overflow: "hidden" }}
              >
                <span className="input-group-text bg-white border-0 text-muted ps-4">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 px-3 py-3"
                  placeholder="Search by suit name or style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container my-5 flex-grow-1">
        {/* Category Filters */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          {categories.map((category) => (
            <button
              key={category}
              className={`btn rounded-pill px-4 py-2 fw-medium ${selectedCategory === category ? "btn-primary shadow-sm" : "btn-outline-secondary bg-white"}`}
              onClick={() => setSelectedCategory(category)}
              style={{ transition: "all 0.2s" }}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredSuits.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-search display-1 mb-3 opacity-25"></i>
            <h4>No suits found</h4>
            <p>Try adjusting your search or category filter.</p>
            <button
              className="btn btn-outline-primary mt-3 rounded-pill"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredSuits.map((suit) => (
              <div key={suit._id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 .5rem 1rem rgba(0,0,0,.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 .125rem .25rem rgba(0,0,0,.075)";
                  }}
                >
                  <div
                    className="card-img-top bg-light position-relative"
                    style={{
                      height: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {suit.image ? (
                      <img
                        src={suit.image}
                        alt={suit.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted opacity-50">
                        <i className="bi bi-suit-spade-fill display-1"></i>
                      </div>
                    )}
                    <span className="badge bg-white text-dark shadow-sm position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill fw-bold">
                      {suit.category}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold fs-4 mb-3 text-truncate">
                      {suit.name}
                    </h5>

                    <div className="d-flex mb-4 gap-2 flex-wrap">
                      <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-normal">
                        Size: <strong>{suit.size}</strong>
                      </span>
                      <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-normal">
                        Color: <strong>{suit.color}</strong>
                      </span>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fs-3 fw-bold text-primary">
                          ${suit.dailyRate}
                        </span>
                        <span className="text-muted ms-1 small fw-medium">
                          / day
                        </span>
                      </div>
                      <button
                        className="btn btn-primary rounded-pill px-4 py-2 fw-medium shadow-sm"
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

      {/* Footer */}
      <footer className="bg-white py-5 border-top mt-auto">
        <div className="container text-center text-muted">
          <div className="mb-2">
            <i className="bi bi-suit-spade-fill fs-3 text-primary"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Hargeisa Suits</h5>
          <p className="mb-2 small">
            📍 Dero Mall &bull; ✉️ hargiesa@gmail.com &bull; 📞 063-409876543
          </p>
          <p className="mb-0 small opacity-75">
            &copy; {new Date().getFullYear()} Hargeisa Suits Rental Management. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;