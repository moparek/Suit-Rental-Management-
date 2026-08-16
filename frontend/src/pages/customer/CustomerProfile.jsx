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
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h2 className="mb-4">My Profile</h2>
        
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
            {error && <Alert type="danger" message={error} onClose={() => setError("")} />}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light" 
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Address</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light" 
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                />
              </div>
              
              <hr className="my-4" />
              
              <h5 className="mb-3">Change Password</h5>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light" 
                  value={form.newPassword}
                  onChange={(e) => setForm({...form, newPassword: e.target.value})}
                />
              </div>
              
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
