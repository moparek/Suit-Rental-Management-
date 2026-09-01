import React, { useEffect, useState } from "react";
import { staffAPI } from "../services/api";
import Loader from "../components/Loader";
import Alert from "../components/Alert";
import Modal from "../components/Modal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "staff",
};

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await staffAPI.getAll();
      setStaff(res.data.staff || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddForm = () => {
    setForm(initialForm);
    setEditId(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      password: "",
      role: member.role,
    });
    setEditId(member._id);
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.phone) errs.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(form.phone))
      errs.phone = "Invalid phone number";
    if (!editId && !form.password) errs.password = "Password is required";
    else if (form.password && form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editId) {
        await staffAPI.update(editId, form);
        setSuccess("Staff member updated successfully");
      } else {
        await staffAPI.create(form);
        setSuccess("Staff member added successfully");
      }
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save staff member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await staffAPI.delete(deleteId);
      setSuccess("Staff member removed successfully");
      setDeleteId(null);
      fetchStaff();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove staff member");
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1">Staff Management</h3>
          <p className="text-muted small mb-0">Manage system users, employee accounts, and role permissions.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openAddForm}
        >
          <FaPlus size={13} /> Add Staff Member
        </button>
      </div>

      {error && (
        <Alert type="danger" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {loading ? (
        <Loader text="Loading staff directory..." />
      ) : staff.length === 0 ? (
        <div className="card p-5 text-center text-muted">
          <div className="mb-2 fs-2">👔</div>
          <h5 className="fw-bold">No staff members found</h5>
          <p className="small mb-0">Add a staff member to grant them system access.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>System Role</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
                          style={{ width: "34px", height: "34px", fontSize: "0.85rem" }}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold">{m.name}</div>
                          <small className="text-muted text-capitalize">{m.role} Account</small>
                        </div>
                      </div>
                    </td>
                    <td className="small text-muted">{m.email}</td>
                    <td className="small text-muted">{m.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          m.role === "admin"
                            ? "bg-primary"
                            : "bg-secondary"
                        }`}
                      >
                        {m.role ? m.role.toUpperCase() : "STAFF"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => openEditForm(m)}
                        title="Edit staff member"
                      >
                        <FaEdit size={12} /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDeleteId(m._id)}
                        title="Remove staff member"
                      >
                        <FaTrash size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        show={showForm}
        title={editId ? "Edit Staff Member" : "Add Staff Member"}
        onClose={() => setShowForm(false)}
        onConfirm={handleSave}
        confirmText={saving ? "Saving..." : "Save"}
      >
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {formErrors.name && (
            <div className="invalid-feedback">{formErrors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {formErrors.email && (
            <div className="invalid-feedback">{formErrors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {formErrors.phone && (
            <div className="invalid-feedback">{formErrors.phone}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            Password{editId ? " (leave blank to keep unchanged)" : ""}
          </label>
          <input
            type="password"
            className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder={editId ? "" : "Minimum 6 characters"}
          />
          {formErrors.password && (
            <div className="invalid-feedback">{formErrors.password}</div>
          )}
        </div>
        <div className="mb-2">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </Modal>

      <Modal
        show={!!deleteId}
        title="Remove Staff Member"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Remove"
      >
        Are you sure you want to remove this staff member?
      </Modal>
    </div>
  );
}

export default StaffList;
