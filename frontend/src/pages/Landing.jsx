import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { suitAPI } from "../services/api";
import "../Styles/landing.css";

// Local Asset Images
import heroImg from "../assets/hero.png";
import weddingSuitImg from "../assets/Wendding-suit.jpg";
import business from "../assets/Business-suit.jpg";
import blackTieImg from "../assets/blackTie-suit.jpg";
import cultureImg from "../assets/Cultural-suit.jpg";
import royalItalianTuxedo from "../assets/royal-italian-midnight-tuxedo.jpg";

// React Icons from FontAwesome 6
import {
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaArrowRight,
  FaCheck,
  FaStar,
  FaClock,
  FaShieldHalved,
  FaScissors,
  FaWandMagicSparkles,
  FaCrown,
  FaFilter,
  FaBars,
  FaXmark,
  FaChevronDown,
  FaChevronUp,
  FaArrowRotateLeft,
  FaArrowUpRightFromSquare,
  FaMagnifyingGlass,
} from "react-icons/fa6";

function Landing() {
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // Check if user is currently logged in
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const categories = [
    "All",
    "Wedding",
    "Business",
    "Casual",
    "Traditional",
    "Formal",
    "Tuxedo",
  ];

  // Curated occasions with background imagery
  const occasions = [
    {
      title: "Wedding & Groomsmen",
      category: "Wedding",
      desc: "Tailored 3-piece elegance & matching groomsmen sets",
      image: weddingSuitImg,
    },
    {
      title: "Black-Tie & Tuxedos",
      category: "Tuxedo",
      desc: "Classic satin lapels & midnight velvet eveningwear",
      image: blackTieImg,
        
    },
    {
      title: "Executive & Business",
      category: "Business",
      desc: "Sharp Italian cut wool suits for conferences & pitches",
      image: business
        
    },
    {
      title: "Formal & Cultural",
      category: "Traditional",
      desc: "Refined ceremonial attire and modern formal designs",
      image: cultureImg
        
    },
  ];

  const faqs = [
    {
      q: "How does the suit rental process work?",
      a: "Simply browse our collection, pick your desired suit, select your event dates, and book online. You can pick up your freshly tailored suit at our Dero Mall showroom or have it delivered. After your event, return it hassle-free—we handle all professional dry cleaning!",
    },
    {
      q: "Are suit alterations and fitting included?",
      a: "Yes! Complimentary minor alterations (such as sleeve length and pant hem adjustments) are included with every rental to ensure a flawless custom fit for your event.",
    },
    {
      q: "What if I need the suit for an extended weekend or destination event?",
      a: "Our daily rental rates are completely flexible. You can book for single days, multi-day weekends, or extended week-long periods with special discounted rates applied for longer rentals.",
    },
    {
      q: "What is your cleaning and hygiene policy?",
      a: "Every single suit undergoes a certified eco-friendly sanitization and dry-cleaning cycle between rentals. Your garment arrives in a sealed garment bag, fresh, pressed, and ready to wear.",
    },
  ];

  useEffect(() => {
    fetchSuits();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   const fetchSuits = async () => {
    try {
      const res = await suitAPI.getAvailable();
      const data = res?.data;
      setSuits(Array.isArray(data) ? data : data?.suits || data?.data || []);
    } catch (err) {
      console.error("Error fetching suits:", err);
      setSuits([]);
    } finally {
      setLoading(false);
    }
  };
  

  const filteredSuits = (Array.isArray(suits) ? suits : []).filter((suit) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||      suit.name?.toLowerCase().includes(term) ||
      suit.category?.toLowerCase().includes(term) ||
      suit.color?.toLowerCase().includes(term) ||
      suit.size?.toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "All" || suit.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (cat) => {
    const list = Array.isArray(suits) ? suits : [];
    if (cat === "All") return list.length;
    return list.filter((s) => s.category === cat).length;
  };

  const handleOccasionClick = (category) => {
    setSelectedCategory(category);
    const collectionEl = document.getElementById("collection");
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="landing-page d-flex flex-column min-vh-100">
     
      <nav
        className={`lux-navbar ${isScrolled ? "scrolled" : ""}`}
      >
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between">
            {/* Brand Logo */}
            <Link className="lux-brand" to="/">
              <div className="lux-brand-icon">
                <FaUserTie />
              </div>
              <div>
                <div className="lux-brand-title">Hargeisa Suits</div>
                <div className="lux-brand-subtitle">Luxury Suit Rentals</div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="d-none d-lg-flex align-items-center gap-2">
              <a href="#collection" className="lux-nav-link">
                Suits Collection
              </a>
              <a href="#occasions" className="lux-nav-link">
                Occasions
              </a>
              <a href="#how-it-works" className="lux-nav-link">
                How It Works
              </a>
              <a href="#faq" className="lux-nav-link">
                FAQ
              </a>
              <a href="#contact" className="lux-nav-link">
                Contact
              </a>
            </div>

            {/* Auth / Action CTA */}
            <div className="d-flex align-items-center gap-2">
              {token && user ? (
                <Link
                  to={
                    user.role === "customer"
                      ? "/customer-dashboard"
                      : "/dashboard"
                  }
                  className="lux-btn-primary"
                >
                  <FaCrown className="text-warning" />
                  <span>My Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="lux-btn-outline d-none d-sm-inline-flex"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="lux-btn-primary">
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                className="btn btn-outline-secondary d-lg-none border-0 p-2 ms-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className="d-lg-none pt-3 pb-2 border-top mt-2">
              <div className="d-flex flex-column gap-2">
                <a
                  href="#collection"
                  className="lux-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Suits Collection
                </a>
                <a
                  href="#occasions"
                  className="lux-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Occasions & Styles
                </a>
                <a
                  href="#how-it-works"
                  className="lux-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#faq"
                  className="lux-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Frequently Asked Questions
                </a>
                <a
                  href="#contact"
                  className="lux-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact & Showroom
                </a>
                {!token && (
                  <Link
                    to="/login"
                    className="lux-btn-outline text-center mt-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

    
      <header className="lux-hero position-relative">
        <div className="lux-hero-bg-overlay"></div>
        <img
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Tailored Suits"
          className="lux-hero-bg-img"
        />
        <div className="lux-hero-grid-pattern"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            {/* Hero Left Content */}
            <div className="col-lg-7 text-start">
              <div className="lux-hero-tag">
                <FaWandMagicSparkles className="text-warning" />
                <span>Premier Formalwear & Suit Rental Boutique</span>
              </div>

              <h1 className="lux-hero-title">
                Elevate Your Style for{" "}
                <span className="lux-hero-title-highlight">
                  Life’s Defining Moments
                </span>
              </h1>

              <p className="lux-hero-desc">
                From bespoke wedding tuxedos to sharp executive business suits,
                experience handcrafted elegance and perfect tailored fits
                without the designer price tag.
              </p>

              {/* Integrated Search Box */}
              <div className="lux-search-box mb-4">
                <FaMagnifyingGlass className="text-muted ms-2 fs-5" />
                <input
                  type="text"
                  className="lux-search-input"
                  placeholder="Search by suit name, category, color, or size..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-sm btn-light rounded-pill px-3 text-muted"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear
                  </button>
                )}
                <a href="#collection" className="lux-btn-gold text-nowrap">
                  Browse Fits
                </a>
              </div>

              {/* Trust highlights */}
              <div className="d-flex flex-wrap gap-4 pt-2 text-light small opacity-90">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: "22px", height: "22px", fontSize: "11px" }}
                  >
                    <FaCheck />
                  </div>
                  <span>100% Tailored Fit Guarantee</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: "22px", height: "22px", fontSize: "11px" }}
                  >
                    <FaCheck />
                  </div>
                  <span>Eco-Friendly Sanitized & Pressed</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: "22px", height: "22px", fontSize: "11px" }}
                  >
                    <FaCheck />
                  </div>
                  <span>Same-Day Fitting & Pickup</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Composition */}
            <div className="col-lg-5">
              <div className="lux-hero-visual">
                {/* Floating Feature Badges */}
                <div className="lux-floating-badge lux-floating-badge-1 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                    style={{ width: "38px", height: "38px" }}
                  >
                    <FaCrown size={18} />
                  </div>
                  <div>
                    <div className="text-white fw-bold small">
                      Bespoke Tailoring
                    </div>
                    <div className="text-warning small" style={{ fontSize: "11px" }}>
                      ★ 4.9/5 Rating (1,200+ Clients)
                    </div>
                  </div>
                </div>

                <div className="lux-hero-main-card">
                  <img
                    src={royalItalianTuxedo}
                    alt="Royal Italian Midnight Tuxedo"
                  />
                  <div className="lux-hero-card-overlay">
                    <div className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill align-self-start mb-2">
                      ⭐ Featured Masterpiece
                    </div>
                    <h5 className="text-white fw-bold mb-1">
                      Royal Italian Midnight Tuxedo
                    </h5>
                    <p className="text-light small mb-0 opacity-80">
                      Crafted from pure wool with silk satin peak lapels.
                    </p>
                  </div>
                </div>

                <div className="lux-floating-badge lux-floating-badge-2 d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: "38px", height: "38px" }}
                  >
                    <FaShieldHalved size={18} />
                  </div>
                  <div>
                    <div className="text-white fw-bold small">
                      Clean & Ready-to-Wear
                    </div>
                    <div className="text-light small opacity-75" style={{ fontSize: "11px" }}>
                      Complimentary Dry Cleaning
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

    
      <section className="lux-stats-strip">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-6 col-md-3">
              <div className="lux-stat-item">
                <div className="lux-stat-icon-wrap">
                  <FaUserTie />
                </div>
                <div>
                  <div className="lux-stat-number">500+</div>
                  <div className="lux-stat-label">Designer Suits in Stock</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="lux-stat-item">
                <div className="lux-stat-icon-wrap">
                  <FaCrown />
                </div>
                <div>
                  <div className="lux-stat-number">2,400+</div>
                  <div className="lux-stat-label">Happy Weddings & Events</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="lux-stat-item">
                <div className="lux-stat-icon-wrap">
                  <FaScissors />
                </div>
                <div>
                  <div className="lux-stat-number">100%</div>
                  <div className="lux-stat-label">Complimentary Alterations</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="lux-stat-item">
                <div className="lux-stat-icon-wrap">
                  <FaStar />
                </div>
                <div>
                  <div className="lux-stat-number">4.9 ★</div>
                  <div className="lux-stat-label">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <section id="occasions" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-uppercase fw-bold text-warning small tracking-wider">
              Curated Formalwear
            </span>
            <h2 className="display-6 fw-bold text-dark mt-1">
              Suits for Every Milestone
            </h2>
            <p className="text-muted">
              Whether you are walking down the aisle, attending a state banquet,
              or leading a boardroom presentation, find the exact cut tailored to
              the moment.
            </p>
          </div>

          <div className="row g-4">
            {occasions.map((occ, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="lux-occasion-card"
                  onClick={() => handleOccasionClick(occ.category)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={occ.image}
                    alt={occ.title}
                    className="lux-occasion-img"
                  />
                  <div className="lux-occasion-overlay">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="badge bg-warning text-dark fw-bold small">
                        {occ.category}
                      </span>
                      <FaArrowUpRightFromSquare className="text-light small opacity-75" />
                    </div>
                    <div className="lux-occasion-title">{occ.title}</div>
                    <p className="lux-occasion-desc">{occ.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------
          Main Suit Catalog / Live Rental Collection
          -------------------------------------------------------------------------- */}
      <section id="collection" className="py-5 bg-light flex-grow-1">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="text-uppercase fw-bold text-warning small tracking-wider">
                Available Inventory
              </span>
              <h2 className="display-6 fw-bold text-dark mb-1">
                Explore Available Suits
              </h2>
              <p className="text-muted mb-0">
                Live availability directly from our Dero Mall showroom.
              </p>
            </div>

            {/* Quick stats indicator */}
            <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
              <FaFilter className="text-warning small" />
              <span className="small text-muted">Showing:</span>
              <strong className="small text-dark">
                {filteredSuits.length} of {suits.length} Suits
              </strong>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="lux-category-pills mb-5">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  className={`lux-category-pill ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>{category}</span>
                  <span className="lux-pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Catalog State Management */}
          {loading ? (
            /* Skeleton Loading State */
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="col-12 col-md-6 col-lg-4">
                  <div className="lux-skeleton-card p-3 d-flex flex-column">
                    <div
                      className="lux-shimmer rounded-3 mb-3"
                      style={{ height: "280px" }}
                    ></div>
                    <div
                      className="lux-shimmer rounded-pill mb-2"
                      style={{ height: "24px", width: "70%" }}
                    ></div>
                    <div
                      className="lux-shimmer rounded-pill mb-4"
                      style={{ height: "18px", width: "45%" }}
                    ></div>
                    <div
                      className="lux-shimmer rounded-pill mt-auto"
                      style={{ height: "42px", width: "100%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSuits.length === 0 ? (
            /* Empty State */
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5 my-4">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <FaMagnifyingGlass className="fs-2 text-muted opacity-50" />
              </div>
              <h4 className="fw-bold text-dark mb-2">No Matching Suits Found</h4>
              <p className="text-muted max-w-500 mx-auto mb-4">
                We couldn't find any available suits matching "
                <strong>{searchTerm}</strong>" in the{" "}
                <strong>{selectedCategory}</strong> collection.
              </p>
              <button
                className="lux-btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                <FaArrowRotateLeft />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            /* Active Suits Grid */
            <div className="row g-4">
              {filteredSuits.map((suit) => {
                const fallbackImg = weddingSuitImg || heroImg;

                return (
                  <div key={suit._id} className="col-12 col-md-6 col-lg-4">
                    <div className="lux-suit-card">
                      {/* Image Thumbnail & Badges */}
                      <div className="lux-suit-card-img-wrap">
                        <img
                          src={suit.image || fallbackImg}
                          alt={suit.name}
                          className="lux-suit-card-img"
                          loading="lazy"
                        />
                        <span className="lux-suit-card-badge">
                          {suit.category}
                        </span>
                        <span className="lux-suit-status-tag">
                          <span
                            className="bg-white rounded-circle"
                            style={{ width: "6px", height: "6px" }}
                          ></span>
                          Available
                        </span>
                      </div>

                      {/* Suit Details */}
                      <div className="lux-suit-card-body">
                        <h5 className="lux-suit-title" title={suit.name}>
                          {suit.name}
                        </h5>

                        <div className="lux-suit-tags">
                          <span className="lux-suit-tag-chip">
                            Size: <strong>{suit.size}</strong>
                          </span>
                          <span className="lux-suit-tag-chip">
                            Color: <strong>{suit.color}</strong>
                          </span>
                          {suit.condition && (
                            <span className="lux-suit-tag-chip">
                              Condition: <strong>{suit.condition}</strong>
                            </span>
                          )}
                        </div>

                        {suit.description && (
                          <p
                            className="text-muted small mb-3 text-truncate"
                            style={{ maxHeight: "40px" }}
                          >
                            {suit.description}
                          </p>
                        )}

                        {/* Price & Action Button */}
                        <div className="lux-suit-card-footer">
                          <div>
                            <span className="lux-suit-price">
                              ${suit.dailyRate}
                            </span>
                            <span className="lux-suit-price-sub">/ day</span>
                          </div>

                          <button
                            className="lux-btn-primary py-2 px-3"
                            onClick={() => navigate(`/suit/${suit._id}`)}
                          >
                            <span>Book Now</span>
                            <FaArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="py-5 bg-white">
        <div className="container py-5">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-uppercase fw-bold text-warning small tracking-wider">
              Seamless Experience
            </span>
            <h2 className="display-6 fw-bold text-dark mt-1">
              How Suit Rental Works
            </h2>
            <p className="text-muted">
              Renting your high-end suit takes just three effortless steps.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">01</span>
                <div className="lux-step-icon">
                  <FaMagnifyingGlass />
                </div>
                <h4 className="fw-bold text-dark mb-2">1. Browse & Select</h4>
                <p className="text-muted mb-0">
                  Explore our extensive inventory of luxury tuxedos, wedding
                  attire, and corporate suits in various sizes and color shades.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">02</span>
                <div className="lux-step-icon">
                  <FaScissors />
                </div>
                <h4 className="fw-bold text-dark mb-2">2. Fit & Reserve</h4>
                <p className="text-muted mb-0">
                  Select your event rental dates online or drop by our showroom
                  at Dero Mall for a personalized fitting with expert tailors.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">03</span>
                <div className="lux-step-icon">
                  <FaWandMagicSparkles />
                </div>
                <h4 className="fw-bold text-dark mb-2">3. Wear & Return</h4>
                <p className="text-muted mb-0">
                  Turn heads at your special occasion, then simply return the
                  suit. We take care of all dry cleaning and sanitization!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="text-uppercase fw-bold text-warning small tracking-wider">
              Got Questions?
            </span>
            <h2 className="display-6 fw-bold text-dark mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-muted">
              Everything you need to know about renting with Hargeisa Suits.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="lux-faq-item">
                    <button
                      className="lux-faq-question"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <FaChevronUp className="text-warning small" />
                      ) : (
                        <FaChevronDown className="text-muted small" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="lux-faq-answer">
                        <p className="mb-0">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="lux-cta-banner text-center text-md-start">
            <div className="lux-cta-banner-overlay"></div>
            <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
              <div className="col-lg-8">
                <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill mb-3">
                  🌟 Book in Advance for Wedding Season
                </span>
                <h2 className="display-5 fw-bold text-white mb-3">
                  Ready to Dress with Distinction?
                </h2>
                <p className="text-light lead mb-0 opacity-85" style={{ maxWidth: "600px" }}>
                  Reserve your favorite suit online now or visit our showroom at
                  Dero Mall for a complimentary personal fitting session.
                </p>
              </div>

              <div className="col-lg-4 text-md-end text-center">
                <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3 justify-content-center">
                  <a href="#collection" className="lux-btn-gold justify-content-center">
                    <span>Reserve a Suit Now</span>
                    <FaArrowRight />
                  </a>
                  {!token && (
                    <Link
                      to="/register"
                      className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold"
                    >
                      Create Account
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="lux-footer mt-auto">
        <div className="container">
          <div className="row g-5">
            {/* Column 1: Brand & Bio */}
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="lux-brand-icon">
                  <FaUserTie />
                </div>
                <div>
                  <h4 className="text-white fw-bold mb-0">Hargeisa Suits</h4>
                  <span className="lux-brand-subtitle">Rental Management</span>
                </div>
              </div>
              <p className="text-secondary small pe-lg-4 mb-4">
                The premier formalwear destination in Somaliland. Offering
                handcrafted luxury tuxedos, wedding collections, and executive
                suits with custom tailoring and concierge service.
              </p>
              <div className="d-flex gap-2">
                <span className="lux-badge-gold">📍 Dero Mall Showroom</span>
                <span className="lux-badge-gold">⭐ 4.9 Star Rated</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-6 col-lg-2">
              <h6 className="lux-footer-heading">Navigation</h6>
              <a href="#collection" className="lux-footer-link">
                Suits Catalog
              </a>
              <a href="#occasions" className="lux-footer-link">
                Occasions
              </a>
              <a href="#how-it-works" className="lux-footer-link">
                How It Works
              </a>
              <a href="#faq" className="lux-footer-link">
                FAQ
              </a>
              <a href="#contact" className="lux-footer-link">
                Contact
              </a>
            </div>

            {/* Column 3: Suit Collections */}
            <div className="col-6 col-lg-3">
              <h6 className="lux-footer-heading">Collections</h6>
              {categories.slice(1).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleOccasionClick(cat)}
                  className="lux-footer-link bg-transparent border-0 text-start p-0"
                >
                  {cat} Suits
                </button>
              ))}
            </div>

          
            <div className="col-lg-3">
              <h6 className="lux-footer-heading">Contact & Showroom</h6>
              <ul className="list-unstyled small text-secondary mb-3">
                <li className="d-flex align-items-start gap-2 mb-2">
                  <FaLocationDot className="text-warning mt-1 flex-shrink-0" />
                  <span>Dero Mall, 2nd Floor, Hargeisa, Somaliland</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <FaPhone className="text-warning flex-shrink-0" />
                  <a href="tel:063409876543" className="text-secondary text-decoration-none">
                    063-409876543
                  </a>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <FaEnvelope className="text-warning flex-shrink-0" />
                  <a href="mailto:hargiesa@gmail.com" className="text-secondary text-decoration-none">
                    hargiesa@gmail.com
                  </a>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FaClock className="text-warning flex-shrink-0" />
                  <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="lux-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center text-md-start">
            <div className="text-secondary">
              &copy; {new Date().getFullYear()} Hargeisa Suits Rental Management
              System. All rights reserved.
            </div>
            <div className="d-flex gap-3 text-secondary small">
              <Link to="/login" className="text-secondary text-decoration-none">
                Staff Portal
              </Link>
              <span>•</span>
              <a href="#collection" className="text-secondary text-decoration-none">
                Browse Fits
              </a>
              <span>•</span>
              <a href="#faq" className="text-secondary text-decoration-none">
                Help & Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
