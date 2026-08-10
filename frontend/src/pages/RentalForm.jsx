import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rentalAPI, customerAPI, suitAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

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
    <div>
      <h3 className="fw-bold mb-4">{isEdit ? "Edit Rental" : "New Rental"}</h3>
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
              <label className="form-label">Customer</label>
              <select
                className={`form-select ${errors.customer ? "is-invalid" : ""}`}
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName} ({c.phone})
                  </option>
                ))}
              </select>
              {errors.customer && (
                <div className="invalid-feedback">{errors.customer}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Suit</label>
              <select
                className={`form-select ${errors.suit ? "is-invalid" : ""}`}
                value={form.suit}
                onChange={(e) => setForm({ ...form, suit: e.target.value })}
              >
                <option value="">Select suit</option>
                {suits.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} - {s.size} (${s.rentalPrice}/day)
                  </option>
                ))}
              </select>
              {errors.suit && (
                <div className="invalid-feedback">{errors.suit}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Rental Date</label>
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
            <div className="col-md-6 mb-3">
              <label className="form-label">Return Date</label>
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
            <div className="col-md-6 mb-3">
              <label className="form-label">Rental Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Returned">Returned</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm({ ...form, paymentStatus: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Rental"
                  : "Create Rental"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
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
