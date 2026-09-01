import React, { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaPhoneAlt } from "react-icons/fa";

function Profile() {
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(localUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await authAPI.getProfile();
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.warn("Could not fetch latest profile, using local session data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading && !user.email) return <Loader text="Loading profile details..." />;

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">User Profile</h3>
        <p className="text-muted small mb-0">Manage your administrator / staff account credentials.</p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

      <div className="card p-4 p-md-5">
        <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom flex-wrap">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fs-1 fw-bold flex-shrink-0"
            style={{ width: "88px", height: "88px", boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
          >
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="fw-bold mb-1">{user?.name || "Authenticated User"}</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary text-uppercase" style={{ letterSpacing: "0.05em" }}>
                {user?.role || "Staff Member"}
              </span>
              <span className="text-muted small">• Active Session</span>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <div className="p-3 rounded border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
              <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                <FaEnvelope size={12} className="text-primary" />
                <span>Email Address</span>
              </div>
              <div className="fw-semibold text-truncate">{user?.email || "—"}</div>
            </div>
          </div>

          <div className="col-12 col-sm-6">
            <div className="p-3 rounded border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
              <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                <FaPhoneAlt size={12} className="text-primary" />
                <span>Phone Number</span>
              </div>
              <div className="fw-semibold">{user?.phone || "Not specified"}</div>
            </div>
          </div>

          <div className="col-12">
            <div className="p-3 rounded border" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
              <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                <FaShieldAlt size={12} className="text-primary" />
                <span>Security & Permissions</span>
              </div>
              <div className="small text-muted">
                Authorized for system operations under role level: <strong className="text-capitalize text-main">{user?.role || "Staff"}</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
