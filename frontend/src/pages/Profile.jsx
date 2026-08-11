import React, { useEffect, useState } from "react";
import { authAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { FaUserCircle } from "react-icons/fa";

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
        // Fallback to localStorage data if fetch fails
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading && !user.email) return <Loader text="Loading profile..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">Profile</h3>
      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

      <div className="card p-4" style={{ maxWidth: 480 }}>
        <div className="text-center mb-4">
          <FaUserCircle size={80} className="text-secondary" />
        </div>
        <div className="mb-3">
          <label className="form-label text-muted">Name</label>
          <p className="fw-bold">{user?.name || "-"}</p>
        </div>
        <div className="mb-3">
          <label className="form-label text-muted">Email</label>
          <p className="fw-bold">{user?.email || "-"}</p>
        </div>
        <div className="mb-3">
          <label className="form-label text-muted">Role</label>
          <p className="fw-bold text-capitalize">{user?.role || "Staff"}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
