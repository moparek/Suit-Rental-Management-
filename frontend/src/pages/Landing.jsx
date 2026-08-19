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
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const categories = ["All","Wedding","Casual","Formal","Tuxedo"];

  const occasions = [
    { title: "Wedding & Groomsmen", category: "Wedding", desc: "Tailored 3-piece elegance & matching groomsmen sets", image: weddingSuitImg },
    { title: "Black-Tie & Tuxedos", category: "Tuxedo", desc: "Classic satin lapels & midnight velvet eveningwear", image: blackTieImg },
    { title: "Executive & Casual", category: "Casual", desc: "Sharp Italian cut wool suits for conferences & pitches", image: business },
    { title: "Formal ", category: "Formal", desc: "Refined ceremonial attire and modern formal designs", image: cultureImg },
  ];

  const signatureLooks = [
    {
      category: "Wedding",
      title: "Executive Tailoring",
      desc: "Sharp Italian cuts for meetings, interviews, and boardroom moments — rented with the same polish as a private atelier.",
      image: weddingSuitImg,
      points: ["Weddings", "Engagements", "Receptions"],
      cta: "Browse Wedding Suits",
    },
    {
      category: "Casual",
      title: "Executive Tailoring",
      desc: "Sharp Italian cuts for meetings, interviews, and boardroom moments — rented with the same polish as a private atelier.",
      image: business,
      points: ["Business meetings", "Interviews", "Conferences"],
      cta: "Browse Business Suits",
    },
  ];

  useEffect(() => {
    fetchSuits();
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
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
      !term ||
      suit.name?.toLowerCase().includes(term) ||
      suit.category?.toLowerCase().includes(term) ||
      suit.color?.toLowerCase().includes(term) ||
      suit.size?.toLowerCase().includes(term);
    const matchesCategory = selectedCategory === "All" || suit.category === selectedCategory;
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
    if (collectionEl) { collectionEl.scrollIntoView({ behavior: "smooth" }); }
  };

  return (
    <div className="landing-page d-flex flex-column min-vh-100">

      {/* ── Navbar ── */}
      <nav className={`lux-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between">
            <Link className="lux-brand" to="/">
              <div className="lux-brand-icon"><FaUserTie /></div>
              <div>
                <div className="lux-brand-title">Hargeisa Suits</div>
                
              </div>
            </Link>

            <div className="d-none d-lg-flex align-items-center gap-1">
              <a href="#collection" className="lux-nav-link">Collection</a>
              <a href="#occasions" className="lux-nav-link">Occasions</a>
              <a href="#signature" className="lux-nav-link">Signature Looks</a>
              <a href="#how-it-works" className="lux-nav-link">How It Works</a>
              <a href="#contact" className="lux-nav-link">Contact</a>
            </div>

            <div className="d-flex align-items-center gap-2">
              {token && user ? (
                <Link to={user.role === "customer" ? "/customer-dashboard" : "/dashboard"} className="lux-btn-primary">
                  <FaCrown />
                  <span className="d-none d-sm-inline">My Dashboard</span>
                  <span className="d-sm-none">Account</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="lux-btn-outline d-none d-sm-inline-flex">Sign In</Link>
                  <Link to="/register" className="lux-btn-primary">Get Started</Link>
                </>
              )}
              <button className="btn btn-outline-secondary d-lg-none border-0 p-2 ms-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
                {mobileMenuOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="d-lg-none pt-3 pb-2 border-top mt-2">
              <div className="d-flex flex-column gap-2">
                <a href="#collection" className="lux-nav-link" onClick={() => setMobileMenuOpen(false)}>Collection</a>
                <a href="#occasions" className="lux-nav-link" onClick={() => setMobileMenuOpen(false)}>Occasions</a>
                <a href="#signature" className="lux-nav-link" onClick={() => setMobileMenuOpen(false)}>Signature Looks</a>
                <a href="#how-it-works" className="lux-nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#contact" className="lux-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                {!token && (
                  <Link to="/login" className="lux-btn-outline text-center mt-2" onClick={() => setMobileMenuOpen(false)}>Sign In to Account</Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="lux-hero position-relative">
        <img src={heroImg} alt="" className="lux-hero-bg-img" aria-hidden="true" />
        <div className="lux-hero-bg-overlay"></div>
        <div className="lux-hero-grid-pattern"></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-start">
              <div className="lux-hero-tag">
                <FaWandMagicSparkles />
                <span>Premier Formalwear Boutique</span>
              </div>
              <h1 className="lux-hero-title">
                Elevate Your Style for{" "}
                <span className="lux-hero-title-highlight">Life's Defining Moments</span>
              </h1>
              <p className="lux-hero-desc">
                From wedding tuxedos to executive suits handcrafted elegance and a perfect fit, without the designer price tag.
              </p>
              <div className="lux-search-box mb-4">
                <FaMagnifyingGlass className="text-muted ms-2 fs-5" />
                <input type="text" className="lux-search-input" placeholder="Search by suit name, category, color, or size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && (<button className="btn btn-sm btn-light rounded-pill px-3 text-muted" onClick={() => setSearchTerm("")}>Clear</button>)}
                <a href="#collection" className="lux-btn-gold text-nowrap">Browse Fits</a>
              </div>
              <div className="d-flex flex-wrap gap-4 pt-2 text-light small opacity-90">
                {[].map((txt) => (
                  <div key={txt} className="lux-hero-perk">
                    <span className="lux-hero-perk-icon"><FaCheck /></span>
                    <span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="lux-hero-visual">
                <div className="lux-floating-badge lux-floating-badge-1 d-flex align-items-center gap-3">
                  <div className="lux-float-icon"><FaCrown size={16} /></div>
                  <div>
                    <div className="text-white fw-bold small">Bespoke Tailoring</div>
                    <div className="lux-float-meta">★ 4.9/5 · 1,200+ clients</div>
                  </div>
                </div>
                <div className="lux-hero-main-card">
                  <img src={royalItalianTuxedo} alt="Royal Italian Midnight Tuxedo" />
                  <div className="lux-hero-card-overlay">
                    <div className="lux-feature-chip">Featured masterpiece</div>
                    <h5 className="text-white fw-bold mb-1">Royal Italian Midnight Tuxedo</h5>
                    <p className="text-white-50 small mb-0">Pure wool with silk satin peak lapels.</p>
                  </div>
                </div>
                <div className="lux-floating-badge lux-floating-badge-2 d-flex align-items-center gap-3">
                  <div className="lux-float-icon"><FaShieldHalved size={16} /></div>
                  <div>
                    <div className="text-white fw-bold small">Clean & Ready-to-Wear</div>
                    <div className="text-light small opacity-75" style={{ fontSize: "11px" }}>Complimentary Dry Cleaning</div>
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
            {[

            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="lux-stat-item">
                  <div className="lux-stat-icon-wrap">{s.icon}</div>
                  <div>
                    <div className="lux-stat-number">{s.num}</div>
                    <div className="lux-stat-label">{s.lbl}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Occasions ── */}
      <section id="occasions" className="lux-section lux-section-white">
        <div className="container">
          <div className="lux-section-intro">
            <span className="lux-eyebrow">Curated formalwear</span>
            <h2 className="lux-heading">Suits for every milestone</h2>
            <p className="lux-lede">Walk down the aisle, attend a banquet, or lead a boardroom find the cut tailored to the moment.</p>
          </div>
          <div className="row g-4">
            {occasions.map((occ, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3">
                <div
                  className="lux-occasion-card"
                  onClick={() => handleOccasionClick(occ.category)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOccasionClick(occ.category);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <img src={occ.image} alt={occ.title} className="lux-occasion-img" />
                  <div className="lux-occasion-overlay">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="lux-occasion-chip">{occ.category}</span>
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

      {/* ── Signature Looks (auth-style panels) ── */}
      <section id="signature" className="lux-signature-section">
        <div className="lux-signature-wash" aria-hidden="true"></div>
        <div className="container position-relative">
          <div className="lux-section-intro lux-section-intro-light">
            <span className="lux-eyebrow lux-eyebrow-light">Signature looks</span>
            <h2 className="lux-heading text-white">Dress with intention</h2>
            <p className="lux-lede lux-lede-light">Two refined directions executive and heritage in the same premium rental experience you sign in for.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {signatureLooks.map((look) => (
              <div key={look.category} className="col-12 col-lg-6 col-xl-5">
                <article className="lux-auth-panel">
                  <div className="lux-auth-panel-media">
                    <img src={look.image} alt={look.title} loading="lazy" />
                    <span className="lux-auth-panel-tag">{look.category}</span>
                  </div>
                  <div className="lux-auth-panel-body">
                    <h3 className="lux-auth-panel-title">{look.title}</h3>
                    <p className="lux-auth-panel-desc">{look.desc}</p>
                    <ul className="lux-auth-panel-points">
                      {look.points.map((point) => (
                        <li key={point}><FaCheck /> {point}</li>
                      ))}
                    </ul>
                    <button type="button" className="lux-btn-primary w-100 justify-content-center" onClick={() => handleOccasionClick(look.category)}>
                      <span>{look.cta}</span>
                      <FaArrowRight size={13} />
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Collection ── */}
      <section id="collection" className="lux-section lux-section-collection flex-grow-1">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="lux-eyebrow">Available inventory</span>
              <h2 className="lux-heading mb-1">Explore available suits</h2>
              <p className="lux-lede mb-0">Live availability from our Dero Mall showroom.</p>
            </div>
            <div className="lux-count-pill">
              <FaFilter />
              <span>Showing</span>
              <strong>{filteredSuits.length} of {suits.length}</strong>
            </div>
          </div>

          <div className="lux-category-pills mb-5">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const isActive = selectedCategory === category;
              return (
                <button key={category} className={`lux-category-pill ${isActive ? "active" : ""}`} onClick={() => setSelectedCategory(category)}>
                  <span>{category}</span>
                  <span className="lux-pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="row g-4">
              {[1,2,3,4,5,6].map((n) => (
                <div key={n} className="col-12 col-md-6 col-lg-4">
                  <div className="lux-skeleton-card p-3 d-flex flex-column">
                    <div className="lux-shimmer rounded-3 mb-3" style={{ height: "280px" }}></div>
                    <div className="lux-shimmer rounded-pill mb-2" style={{ height: "24px", width: "70%" }}></div>
                    <div className="lux-shimmer rounded-pill mb-4" style={{ height: "18px", width: "45%" }}></div>
                    <div className="lux-shimmer rounded-pill mt-auto" style={{ height: "42px", width: "100%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSuits.length === 0 ? (
            <div className="lux-empty-state">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                <FaMagnifyingGlass className="fs-2 text-muted opacity-50" />
              </div>
              <h4 className="fw-bold text-dark mb-2">No Matching Suits Found</h4>
              <p className="text-muted max-w-500 mx-auto mb-4">We could not find any available suits matching "<strong>{searchTerm}</strong>" in the <strong>{selectedCategory}</strong> collection.</p>
              <button className="lux-btn-primary" onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}>
                <FaArrowRotateLeft />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredSuits.map((suit) => {
                const fallbackImg = weddingSuitImg || heroImg;
                return (
                  <div key={suit._id} className="col-12 col-md-6 col-lg-4">
                    <div className="lux-suit-card">
                      <div className="lux-suit-card-img-wrap">
                        <img src={suit.image || fallbackImg} alt={suit.name} className="lux-suit-card-img" loading="lazy" />
                        <span className="lux-suit-card-badge">{suit.category}</span>
                        <span className="lux-suit-status-tag">
                          <span className="bg-white rounded-circle" style={{ width: "6px", height: "6px" }}></span>
                          Available
                        </span>
                      </div>
                      <div className="lux-suit-card-body">
                        <h5 className="lux-suit-title" title={suit.name}>{suit.name}</h5>
                        <div className="lux-suit-tags">
                          <span className="lux-suit-tag-chip">Size: <strong>{suit.size}</strong></span>
                          <span className="lux-suit-tag-chip">Color: <strong>{suit.color}</strong></span>
                          {suit.condition && (<span className="lux-suit-tag-chip">Condition: <strong>{suit.condition}</strong></span>)}
                        </div>
                        {suit.description && (<p className="text-muted small mb-3 text-truncate" style={{ maxHeight: "40px" }}>{suit.description}</p>)}
                        <div className="lux-suit-card-footer">
                          <div>
                            <span className="lux-suit-price">${suit.dailyRate}</span>
                            <span className="lux-suit-price-sub">/ day</span>
                          </div>
                          <button className="lux-btn-primary py-2 px-3" onClick={() => navigate(`/suit/${suit._id}`)}>
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

      {/* ── How It Works ── */}
      <section id="how-it-works" className="lux-section lux-section-white">
        <div className="container">
          <div className="lux-section-intro">
            <span className="lux-eyebrow">Seamless experience</span>
            <h2 className="lux-heading">How suit rental works</h2>
            <p className="lux-lede">Three steps from browse to wear the same account you use on login.</p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">01</span>
                <div className="lux-step-icon"><FaMagnifyingGlass /></div>
                <h4 className="fw-bold text-dark mb-2">1. Browse & Select</h4>
                <p className="text-muted mb-0">Explore our extensive inventory of luxury tuxedos, wedding attire, and corporate suits in various sizes and color shades.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">02</span>
                <div className="lux-step-icon"><FaScissors /></div>
                <h4 className="fw-bold text-dark mb-2">2. Fit & Reserve</h4>
                <p className="text-muted mb-0">Select your event rental dates online or drop by our showroom at Dero Mall for a personalized fitting with expert tailors.</p>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="lux-step-card">
                <span className="lux-step-number">03</span>
                <div className="lux-step-icon"><FaWandMagicSparkles /></div>
                <h4 className="fw-bold text-dark mb-2">3. Wear & Return</h4>
                <p className="text-muted mb-0">Turn heads at your special occasion, then simply return the suit. We take care of all dry cleaning and sanitization!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="lux-section lux-section-cta">
        <div className="container">
          <div className="lux-cta-banner">
            <img src={weddingSuitImg} alt="" className="lux-cta-banner-img" aria-hidden="true" />
            <div className="lux-cta-banner-overlay"></div>
            <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
              <div className="col-lg-7 text-center text-lg-start">
                <span className="lux-eyebrow lux-eyebrow-light mb-3 d-inline-block">Wedding season</span>
                <h2 className="lux-heading text-white mb-3">Ready to dress with distinction?</h2>
                <p className="lux-lede lux-lede-light mb-0">Reserve online or visit Dero Mall for a complimentary fitting then sign in with the same account used across the system.</p>
              </div>
              <div className="col-lg-5">
                <div className="lux-cta-actions">
                  <a href="#collection" className="lux-btn-gold justify-content-center">
                    <span>Reserve a Suit</span>
                    <FaArrowRight />
                  </a>
                  {!token && (
                    <Link to="/register" className="lux-btn-outline-light justify-content-center">Create Account</Link>
                  )}
                  {!token && (
                    <Link to="/login" className="lux-cta-login-link">Already a member? Sign in</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="lux-footer mt-auto">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="lux-brand-icon"><FaUserTie /></div>
                <div>
                  <h4 className="text-white fw-bold mb-0">Hargeisa Suits</h4>
                  <span className="lux-brand-subtitle">Rental Management</span>
                </div>
              </div>
              <p className="text-secondary small pe-lg-4 mb-4">The premier formalwear destination in Somaliland. Offering handcrafted luxury tuxedos, wedding collections, and executive suits with custom tailoring and concierge service.</p>
              <div className="d-flex gap-2">
                <span className="lux-badge-gold">📍 Dero Mall Showroom</span>
                
              </div>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="lux-footer-heading">Navigation</h6>
              <a href="#collection" className="lux-footer-link">Suits Catalog</a>
              <a href="#occasions" className="lux-footer-link">Occasions</a>
              <a href="#signature" className="lux-footer-link">Signature Looks</a>
              <a href="#how-it-works" className="lux-footer-link">How It Works</a>
              <a href="#contact" className="lux-footer-link">Contact</a>
            </div>

            <div className="col-6 col-lg-3">
              <h6 className="lux-footer-heading">Collections</h6>
              {categories.slice(1).map((cat) => (
                <button key={cat} onClick={() => handleOccasionClick(cat)} className="lux-footer-link bg-transparent border-0 text-start p-0">{cat} Suits</button>
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
                  <a href="tel:063409876543" className="text-secondary text-decoration-none">063-409876543</a>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <FaEnvelope className="text-warning flex-shrink-0" />
                  <a href="mailto:hargiesa@gmail.com" className="text-secondary text-decoration-none">hargiesa@gmail.com</a>
                </li>
                <li className="d-flex align-items-center gap-2">
                 
                  
                </li>
              </ul>
            </div>
          </div>

          <div className="lux-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center text-md-start">
            <div className="text-secondary">&copy; {new Date().getFullYear()} Hargeisa Suits Rental Management System. All rights reserved.</div>
            <div className="d-flex gap-3 text-secondary small">
              <Link to="/login" className="text-secondary text-decoration-none">Staff Portal</Link>
              <span>•</span>
              <a href="#collection" className="text-secondary text-decoration-none">Browse Fits</a>
              <span>•</span>
              <a href="#signature" className="text-secondary text-decoration-none">Signature Looks</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
