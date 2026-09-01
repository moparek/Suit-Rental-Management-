import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group search-bar">
      <span className="input-group-text">
        <FaSearch size={14} />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="btn btn-outline-secondary border-start-0"
          onClick={() => onChange("")}
          aria-label="Clear search"
          title="Clear search"
        >
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
