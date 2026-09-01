import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaUser } from "react-icons/fa";

function CustomerSearchSelect({ customers = [], value, onChange, isInvalid }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find currently selected customer
  const selectedCustomer = customers.find((c) => c._id === value);

  // Sync search input string with selected customer or empty string
  useEffect(() => {
    if (selectedCustomer) {
      const name = selectedCustomer.fullName || selectedCustomer.name || "";
      const phone = selectedCustomer.phone || "";
      setSearchTerm(phone ? `${name} (${phone})` : name);
    } else if (!value) {
      setSearchTerm("");
    }
  }, [value, customers, selectedCustomer]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        // Reset display text if dropdown was closed without selecting new customer
        if (selectedCustomer) {
          const name = selectedCustomer.fullName || selectedCustomer.name || "";
          const phone = selectedCustomer.phone || "";
          setSearchTerm(phone ? `${name} (${phone})` : name);
        } else if (!value) {
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCustomer, value]);

  // Filter customers by name or phone
  const selectedText = selectedCustomer
    ? `${selectedCustomer.fullName || selectedCustomer.name || ""} (${selectedCustomer.phone || ""})`
    : "";

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm || (selectedCustomer && searchTerm === selectedText)) {
      return true;
    }
    const query = searchTerm.toLowerCase().trim();
    const nameStr = (c.fullName || c.name || "").toLowerCase();
    const phoneStr = (c.phone || "").toLowerCase();
    return nameStr.includes(query) || phoneStr.includes(query);
  });

  const handleSelect = (c) => {
    onChange(c._id);
    const name = c.fullName || c.name || "";
    const phone = c.phone || "";
    setSearchTerm(phone ? `${name} (${phone})` : name);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);
    if (value) {
      onChange(""); // reset selected value if user starts typing something new
    }
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <div className="input-group">
        <span className="input-group-text">
          <FaSearch size={14} />
        </span>
        <input
          type="text"
          className={`form-control ${isInvalid ? "is-invalid" : ""}`}
          placeholder="Search customer by name or phone..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {value && (
          <button
            type="button"
            className="btn btn-outline-secondary border-start-0"
            onClick={handleClear}
            title="Clear selected customer"
          >
            <FaTimes size={13} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="position-absolute w-100 customer-dropdown-menu mt-1"
          style={{ zIndex: 1050 }}
        >
          {filteredCustomers.length === 0 ? (
            <div className="p-3 text-muted text-center small">
              No customer found matching "{searchTerm}"
            </div>
          ) : (
            <div>
              {filteredCustomers.slice(0, 50).map((c) => {
                const name = c.fullName || c.name || "Unnamed Customer";
                const isSelected = c._id === value;
                return (
                  <button
                    type="button"
                    key={c._id}
                    className={`w-100 customer-dropdown-item d-flex align-items-center justify-content-between text-start border-0 ${
                      isSelected ? "active" : ""
                    }`}
                    onClick={() => handleSelect(c)}
                  >
                    <div>
                      <div className="fw-semibold small">
                        <FaUser className="me-2 text-primary opacity-75" size={12} />
                        {name}
                      </div>
                      <small className="text-muted">
                        {c.phone || "No phone"}
                      </small>
                    </div>
                    {isSelected && (
                      <span className="badge bg-primary ms-2">Selected</span>
                    )}
                  </button>
                );
              })}
              {filteredCustomers.length > 50 && (
                <div className="p-2 text-center text-muted small border-top" style={{ backgroundColor: "var(--bg-surface-subtle)" }}>
                  Showing first 50 results. Type to refine your search.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerSearchSelect;
