import React from 'react';

/**
 * Filter Component
 * Dropdown controls for filtering and sorting hotel listings.
 *
 * @param {Object} props
 * @param {string} props.selectedLocation - Currently selected location filter
 * @param {Function} props.onLocationChange - Callback when location changes
 * @param {string} props.selectedSort - Currently selected sort order
 * @param {Function} props.onSortChange - Callback when sort order changes
 */
const Filter = ({
  selectedLocation = '',
  onLocationChange,
  selectedSort = '',
  onSortChange,
  locations = []
}) => {
  // Use passed locations or fallback default
  const availableLocations =
    locations.length > 0 ? locations : ['Mumbai', 'Goa', 'Manali'];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="location-filter" className="filter-label">
          Location:
        </label>
        <select
          id="location-filter"
          className="filter-select"
          value={selectedLocation}
          onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
        >
          <option value="">All Locations</option>
          {availableLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter" className="filter-label">
          Sort By:
        </label>
        <select
          id="sort-filter"
          className="filter-select"
          value={selectedSort}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
