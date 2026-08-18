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
    <div>
      <h3 className="fw-bold mb-4">{isEdit ? "Edit Suit" : "Add Suit"}</h3>
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
              <label className="form-label">Suit Name</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
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
            <div className="col-md-4 mb-3">
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
            <div className="col-md-4 mb-3">
              <label className="form-label">Color</label>
              <input
                className={`form-control ${errors.color ? "is-invalid" : ""}`}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
              {errors.color && (
                <div className="invalid-feedback">{errors.color}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Rental Price ($/day)</label>
              <input
                type="number"
                className={`form-control ${errors.rentalPrice ? "is-invalid" : ""}`}
                value={form.rentalPrice}
                onChange={(e) =>
                  setForm({ ...form, rentalPrice: e.target.value })
                }
              />
              {errors.rentalPrice && (
                <div className="invalid-feedback">{errors.rentalPrice}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Condition</label>
              <select
                className="form-select"
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-end">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="availability"
                  checked={form.availability}
                  onChange={(e) =>
                    setForm({ ...form, availability: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="availability">
                  Available for rent
                </label>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Image URL / Upload Image</label>
              <div className="input-group">
                <input
                  className="form-control"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/suit.jpg or choose a file from device"
                />
                <label className="btn btn-outline-secondary mb-0 d-flex align-items-center gap-1 cursor-pointer">
                  📁 Choose File
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
                <div className="mt-2 d-flex align-items-center gap-2">
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <small className="text-muted">Image preview</small>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Suit" : "Add Suit"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
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
