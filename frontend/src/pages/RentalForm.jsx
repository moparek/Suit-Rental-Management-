import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rentalAPI, customerAPI, suitAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

import CustomerSearchSelect from "../components/CustomerSearchSelect";

const initialState = {
  customer: "",
  suit: "",
  rentalDate: "",
  returnDate: "",
  status: "Active",
  paymentStatus: "Pending",
};

function RentalForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [customers, setCustomers] = useState([]);
  const [suits, setSuits] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [customersRes, suitsRes] = await Promise.all([
          customerAPI.getAll(),
          suitAPI.getAll(),
        ]);
        setCustomers(customersRes.data.customers || customersRes.data || []);
        setSuits(suitsRes.data.suits || suitsRes.data || []);

        if (isEdit) {
          const rentalRes = await rentalAPI.getOne(id);
          const r = rentalRes.data;
          setForm({
            customer: r.customer?._id || r.customer || "",
            suit: r.suit?._id || r.suit || "",
            rentalDate: r.rentalDate ? r.rentalDate.substring(0, 10) : "",
            returnDate: r.returnDate ? r.returnDate.substring(0, 10) : "",
            status: r.status || "Active",
            paymentStatus: r.paymentStatus || "Pending",
          });
        }
      } catch (err) {
        setServerError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.customer) errs.customer = "Please select a customer";
    if (!form.suit) errs.suit = "Please select a suit";
    if (!form.rentalDate) errs.rentalDate = "Rental date is required";
    if (!form.returnDate) errs.returnDate = "Return date is required";
    else if (form.rentalDate && form.returnDate < form.rentalDate)
      errs.returnDate = "Return date cannot be before rental date";
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
        await rentalAPI.update(id, form);
      } else {
        await rentalAPI.create(form);
      }
      navigate("/rentals");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save rental");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading rental form..." />;

  return (
    <div className="max-w-900 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            {isEdit ? "Edit Rental Record" : "Create In-Store Rental"}
          </h3>
          <p className="text-muted small mb-0">
            {isEdit
              ? "Update rental duration, return dates, and payment status."
              : "Register an in-store suit checkout for a verified customer."}
          </p>
        </div>
      </div>

      {serverError && (
        <Alert
          type="danger"
          message={serverError}
          onClose={() => setServerError("")}
        />
      )}

      <div className="card p-4 p-md-5">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3 g-md-4">
            <div className="col-12">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Client & Garment Selection
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Customer *</label>
              <CustomerSearchSelect
                customers={customers}
                value={form.customer}
                onChange={(val) => setForm({ ...form, customer: val })}
                isInvalid={Boolean(errors.customer)}
              />
              {errors.customer && (
                <div className="invalid-feedback d-block">{errors.customer}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Suit *</label>
              <select
                className={`form-select ${errors.suit ? "is-invalid" : ""}`}
                value={form.suit}
                onChange={(e) => setForm({ ...form, suit: e.target.value })}
              >
                <option value="">Choose suit from inventory...</option>
                {suits.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — Size {s.size} (${s.rentalPrice}/day)
                  </option>
                ))}
              </select>
              {errors.suit && (
                <div className="invalid-feedback">{errors.suit}</div>
              )}
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Schedule & Status
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Rental / Checkout Date *</label>
              <input
                type="date"
                className={`form-control ${errors.rentalDate ? "is-invalid" : ""}`}
                value={form.rentalDate}
                onChange={(e) =>
                  setForm({ ...form, rentalDate: e.target.value })
                }
              />
              {errors.rentalDate && (
                <div className="invalid-feedback">{errors.rentalDate}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Expected Return Date *</label>
              <input
                type="date"
                className={`form-control ${errors.returnDate ? "is-invalid" : ""}`}
                value={form.returnDate}
                onChange={(e) =>
                  setForm({ ...form, returnDate: e.target.value })
                }
              />
              {errors.returnDate && (
                <div className="invalid-feedback">{errors.returnDate}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Rental Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active (Currently Rented)</option>
                <option value="Returned">Returned (Completed)</option>
                <option value="Overdue">Overdue (Past Return Date)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm({ ...form, paymentStatus: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid (Full Settlement)</option>
                <option value="Partial">Partial Payment</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 pt-3 border-top">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Rental Record"
                  : "Create Rental Checkout"}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => navigate("/rentals")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;
