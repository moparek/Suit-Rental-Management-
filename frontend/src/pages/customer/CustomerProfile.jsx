import React, { useState } from "react";
import { authAPI } from "../../services/api";
import Alert from "../../components/Alert";

function CustomerProfile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    newPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authAPI.updateProfile(form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setSuccess("Profile updated successfully!");
      setForm({ ...form, newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-900 mx-auto" style={{ maxWidth: "720px" }}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">My Account Settings</h3>
        <p className="text-muted small mb-0">Update your contact information, delivery address, and security password.</p>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
      {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

      <div className="card p-4 p-md-5">
        {/* User Identity Banner */}
        <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom flex-wrap">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fs-2 fw-bold flex-shrink-0"
            style={{ width: "76px", height: "76px", boxShadow: "0 0 20px rgba(99, 102, 241, 0.25)" }}
          >
            {(user.name || "C").charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="fw-bold mb-1">{user.name || "Valued Client"}</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary">Verified Customer</span>
              <span className="text-muted small">• Personal Account</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 g-md-4">
            <div className="col-12">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Contact & Identity Details
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="form-control" 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Phone Number *</label>
              <input 
                type="text" 
                className="form-control" 
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Physical Address</label>
              <input 
                type="text" 
                className="form-control" 
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. 26 June District, Hargeisa"
              />
            </div>
            
            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Security
              </h6>
              <hr className="mt-1 mb-3" />
            </div>
            
            <div className="col-12">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input 
                type="password" 
                className="form-control" 
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-top d-flex gap-3">
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerProfile;
