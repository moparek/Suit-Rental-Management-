import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="input-group search-bar">
      <span className="input-group-text bg-white">
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
