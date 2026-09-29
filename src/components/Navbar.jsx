import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navbar Component
 * Provides global navigation across the application.
 */
const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <span>🏨</span> HotelStay
        </NavLink>
        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Hotels
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                My Bookings
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
