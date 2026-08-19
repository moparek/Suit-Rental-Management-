import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-wrapper">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="lead mb-4">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
