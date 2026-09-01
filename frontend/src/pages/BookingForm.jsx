import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingAPI, suitAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const initialState = {
  customerName: "",
  phone: "",
  suit: "",
  size: "M",
  price: "",
  bookingDate: "",
  status: "Reserved",
  notes: "",
};

function BookingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [suits, setSuits] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const suitsRes = await suitAPI.getAll();
        setSuits(suitsRes.data.suits || suitsRes.data || []);

        if (isEdit) {
          const bookingRes = await bookingAPI.getOne(id);
          const b = bookingRes.data;
          setForm({
            customerName: b.customerName || "",
            phone: b.phone || "",
            suit: b.suit?._id || b.suit || "",
            size: b.size || "M",
            price: b.price ?? "",
            bookingDate: b.bookingDate ? b.bookingDate.substring(0, 10) : "",
            status: b.status || "Reserved",
            notes: b.notes || "",
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

  // Auto-fill price from the selected suit's rental price, unless the staff
  // member has already typed a custom price for this booking.
  const handleSuitChange = (suitId) => {
    const selectedSuit = suits.find((s) => s._id === suitId);
    setForm((prev) => ({
      ...prev,
      suit: suitId,
      price: selectedSuit ? selectedSuit.rentalPrice : prev.price,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName) errs.customerName = "Customer name is required";
    if (!form.phone) errs.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(form.phone))
      errs.phone = "Invalid phone number";
    if (!form.suit) errs.suit = "Please select a suit";
    if (!form.price) errs.price = "Price is required";
    else if (isNaN(form.price) || Number(form.price) <= 0)
      errs.price = "Enter a valid price";
    if (!form.bookingDate) errs.bookingDate = "Booking date is required";
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
        await bookingAPI.update(id, form);
      } else {
        await bookingAPI.create(form);
      }
      navigate("/bookings");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading booking form..." />;

  return (
    <div className="max-w-900 mx-auto" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            {isEdit ? "Edit Reservation" : "Record Phone Reservation"}
          </h3>
          <p className="text-muted small mb-0">
            Record and manage manual phone or walk-in reservations for atelier suits.
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
                Caller & Client Details
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Customer Name *</label>
              <input
                className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                placeholder="Full name of caller"
              />
              {errors.customerName && (
                <div className="invalid-feedback">{errors.customerName}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number *</label>
              <input
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +252 63 4123456"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Garment & Rate
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Selected Suit *</label>
              <select
                className={`form-select ${errors.suit ? "is-invalid" : ""}`}
                value={form.suit}
                onChange={(e) => handleSuitChange(e.target.value)}
              >
                <option value="">Select suit from inventory...</option>
                {suits.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (${s.rentalPrice}/day)
                  </option>
                ))}
              </select>
              {errors.suit && (
                <div className="invalid-feedback">{errors.suit}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label">Size</label>
              <select
                className="form-select"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Agreed Price ($) *</label>
              <input
                type="number"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Schedule & Notes
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Booking / Event Date *</label>
              <input
                type="date"
                className={`form-control ${errors.bookingDate ? "is-invalid" : ""}`}
                value={form.bookingDate}
                onChange={(e) =>
                  setForm({ ...form, bookingDate: e.target.value })
                }
              />
              {errors.bookingDate && (
                <div className="invalid-feedback">{errors.bookingDate}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Reservation Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Reserved">Reserved (Pending Fitting)</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Fitting / Consultation Notes</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Caller requirements, wedding date, custom tailoring needs..."
              />
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 pt-3 border-top">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Reservation"
                  : "Save Reservation"}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => navigate("/bookings")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
