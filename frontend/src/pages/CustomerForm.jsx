import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { customerAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const initialState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  idType: "nationalId",
};

function CustomerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await customerAPI.getOne(id);
        setForm({
          ...initialState,
          ...res.data,
          fullName: res.data.fullName || res.data.name || "",
          idType: res.data.idType || "nationalId",
        });
      } catch (err) {
        setServerError(
          err.response?.data?.message || "Failed to load customer",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.fullName) errs.fullName = "Full name is required";
    if (!form.phone) errs.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(form.phone))
      errs.phone = "Invalid phone number";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Invalid email format";
    if (!form.address) errs.address = "Address is required";
    if (!form.idType) errs.idType = "Please select an ID type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await customerAPI.update(id, form);
      } else {
        await customerAPI.create(form);
      }
      navigate("/customers");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading customer details..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h3>
      {serverError && (
        <Alert
          type="danger"
          message={serverError}
          onClose={() => setServerError("")}
        />
      )}

      <div className="card p-4">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">ID Type</label>
              <select
                className={`form-select ${errors.idType ? "is-invalid" : ""}`}
                value={form.idType}
                onChange={(e) => setForm({ ...form, idType: e.target.value })}
              >
                <option value="nationalId">National ID</option>
                <option value="passport">Passport</option>
              </select>
              {errors.idType && (
                <div className="invalid-feedback">{errors.idType}</div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Customer"
                  : "Add Customer"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
