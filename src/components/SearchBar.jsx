import React from 'react';

/**
 * SearchBar Component
 * Provides an input field for users to search hotels by name or location.
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query string
 * @param {Function} props.onSearchChange - Handler function when query changes
 */
const SearchBar = ({ searchQuery = '', onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        id="hotel-search-input"
        type="text"
        className="search-input"
        placeholder="Search by hotel name or city..."
        aria-label="Search by hotel name or city"
        value={searchQuery}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
