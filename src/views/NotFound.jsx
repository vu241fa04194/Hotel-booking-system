import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound View
 * Displayed when user visits an undefined URL path (404).
 */
const NotFound = () => {
  return (
    <div className="page-header">
      <h1 className="page-title">404 - Page Not Found</h1>
      <p className="page-subtitle mb-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
