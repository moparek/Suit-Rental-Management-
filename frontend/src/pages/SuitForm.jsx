import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { suitAPI } from "../services/api";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const initialState = {
  name: "",
  category: "Formal",
  size: "M",
  color: "",
  rentalPrice: "",
  availability: true,
  condition: "Good",
  image: "",
};

function SuitForm() {
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
    const fetchSuit = async () => {
      setLoading(true);
      try {
        const res = await suitAPI.getOne(id);
        setForm({ ...initialState, ...res.data });
      } catch (err) {
        setServerError(err.response?.data?.message || "Failed to load suit");
      } finally {
        setLoading(false);
      }
    };
    fetchSuit();
  }, [id, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Suit name is required";
    if (!form.color) errs.color = "Color is required";
    if (!form.rentalPrice) errs.rentalPrice = "Rental price is required";
    else if (isNaN(form.rentalPrice) || Number(form.rentalPrice) <= 0)
      errs.rentalPrice = "Enter a valid price";
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
        await suitAPI.update(id, form);
      } else {
        await suitAPI.create(form);
      }
      navigate("/suits");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save suit");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading suit details..." />;

  return (
    <div className="max-w-900 mx-auto" style={{ maxWidth: "840px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">{isEdit ? "Edit Suit Details" : "Add New Suit"}</h3>
          <p className="text-muted small mb-0">
            {isEdit
              ? "Modify the inventory specifications and pricing for this suit."
              : "Register a new suit or tuxedo into the atelier rental collection."}
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
                Suit Information
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Suit Name *</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Midnight Navy Tuxedo"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Formal">Formal</option>
                <option value="Wedding">Wedding</option>
                <option value="Casual">Casual</option>
                <option value="Tuxedo">Tuxedo</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Size *</label>
              <select
                className="form-select"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              >
                <option value="S">S (Small)</option>
                <option value="M">M (Medium)</option>
                <option value="L">L (Large)</option>
                <option value="XL">XL (Extra Large)</option>
                <option value="XXL">XXL (Double Extra Large)</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Color *</label>
              <input
                className={`form-control ${errors.color ? "is-invalid" : ""}`}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="e.g. Midnight Blue, Charcoal"
              />
              {errors.color && (
                <div className="invalid-feedback">{errors.color}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Rental Price ($/day) *</label>
              <input
                type="number"
                className={`form-control ${errors.rentalPrice ? "is-invalid" : ""}`}
                value={form.rentalPrice}
                onChange={(e) =>
                  setForm({ ...form, rentalPrice: e.target.value })
                }
                placeholder="e.g. 45"
              />
              {errors.rentalPrice && (
                <div className="invalid-feedback">{errors.rentalPrice}</div>
              )}
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Condition & Availability
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Suit Condition</label>
              <select
                className="form-select"
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                <option value="New">New (Pristine)</option>
                <option value="Good">Good (Ready to Wear)</option>
                <option value="Fair">Fair (Minor Wear)</option>
                <option value="Needs Repair">Needs Repair (In Atelier)</option>
              </select>
            </div>

            <div className="col-md-6 d-flex align-items-center pt-md-4">
              <div className="form-check form-switch p-0 d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  className="form-check-input ms-0"
                  id="availability"
                  style={{ width: "2.4em", height: "1.25em" }}
                  checked={form.availability}
                  onChange={(e) =>
                    setForm({ ...form, availability: e.target.checked })
                  }
                />
                <label className="form-check-label fw-semibold cursor-pointer" htmlFor="availability">
                  Ready for Immediate Rental
                </label>
              </div>
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-primary text-uppercase small letter-spacing-wide mb-1">
                Imagery
              </h6>
              <hr className="mt-1 mb-3" />
            </div>

            <div className="col-12">
              <label className="form-label">Image URL or Local Upload</label>
              <div className="input-group">
                <input
                  className="form-control"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... or choose file"
                />
                <label className="btn btn-outline-secondary mb-0 d-flex align-items-center gap-1 cursor-pointer">
                  📁 Browse File
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {form.image && (
                <div className="mt-3 p-2 bg-light rounded d-flex align-items-center gap-3 border" style={{ maxWidth: "340px" }}>
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div>
                    <div className="small fw-bold">Image Preview</div>
                    <small className="text-muted">High-resolution showcase</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-3 mt-4 pt-3 border-top">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Suit" : "Add Suit to Inventory"}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={() => navigate("/suits")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuitForm;
