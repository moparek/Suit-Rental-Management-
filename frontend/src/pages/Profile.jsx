import React, { useState } from "react";
import Alert from "../components/Alert";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [success] = useState("");

  return (
    <div>
      <h3 className="fw-bold mb-4">Profile</h3>
      {success && <Alert type="success" message={success} />}

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
          <p className="fw-bold">{user?.role || "Staff"}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
