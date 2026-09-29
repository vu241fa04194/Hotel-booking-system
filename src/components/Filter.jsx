import React from 'react';

/**
 * Filter Component
 * Controls for filtering by location, min/max price, minimum rating, and sorting.
 *
 * @param {Object} props
 * @param {string} props.selectedLocation - Currently selected location filter
 * @param {Function} props.onLocationChange - Callback when location changes
 * @param {string|number} props.minPrice - Minimum price filter
 * @param {Function} props.onMinPriceChange - Callback when min price changes
 * @param {string|number} props.maxPrice - Maximum price filter
 * @param {Function} props.onMaxPriceChange - Callback when max price changes
 * @param {string|number} props.minRating - Minimum rating filter
 * @param {Function} props.onMinRatingChange - Callback when min rating changes
 * @param {string} props.selectedSort - Currently selected sort order
 * @param {Function} props.onSortChange - Callback when sort order changes
 * @param {Array<string>} props.locations - Available hotel locations
 * @param {Function} props.onResetFilters - Callback to clear all active filters
 */
const Filter = ({
  selectedLocation = '',
  onLocationChange,
  minPrice = '',
  onMinPriceChange,
  maxPrice = '',
  onMaxPriceChange,
  minRating = '',
  onMinRatingChange,
  onlyAvailable = false,
  onOnlyAvailableChange,
  selectedSort = '',
  onSortChange,
  locations = [],
  onResetFilters
}) => {
  const availableLocations =
    locations.length > 0 ? locations : ['Mumbai', 'Goa', 'Manali', 'Jaipur', 'Bengaluru'];

  return (
    <div className="filter-bar">
      {/* Location Filter */}
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

      {/* Min Price Filter */}
      <div className="filter-group">
        <label htmlFor="min-price-filter" className="filter-label">
          Min Price:
        </label>
        <input
          id="min-price-filter"
          type="number"
          min="0"
          step="500"
          placeholder="₹ Min"
          className="filter-input"
          value={minPrice}
          onChange={(e) => onMinPriceChange && onMinPriceChange(e.target.value)}
        />
      </div>

      {/* Max Price Filter */}
      <div className="filter-group">
        <label htmlFor="max-price-filter" className="filter-label">
          Max Price:
        </label>
        <input
          id="max-price-filter"
          type="number"
          min="0"
          step="500"
          placeholder="₹ Max"
          className="filter-input"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange && onMaxPriceChange(e.target.value)}
        />
      </div>

      {/* Rating Filter */}
      <div className="filter-group">
        <label htmlFor="rating-filter" className="filter-label">
          Rating:
        </label>
        <select
          id="rating-filter"
          className="filter-select"
          value={minRating}
          onChange={(e) => onMinRatingChange && onMinRatingChange(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4.5">★ 4.5 & above</option>
          <option value="4.0">★ 4.0 & above</option>
          <option value="3.5">★ 3.5 & above</option>
        </select>
      </div>

      {/* Available Rooms Only Filter */}
      <div className="filter-group filter-checkbox-group">
        <label htmlFor="filter-available-only" className="filter-checkbox-label">
          <input
            id="filter-available-only"
            type="checkbox"
            className="filter-checkbox"
            checked={onlyAvailable}
            onChange={(e) => onOnlyAvailableChange && onOnlyAvailableChange(e.target.checked)}
          />
          <span>Available Rooms Only</span>
        </label>
      </div>

      {/* Sorting Control */}
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
          <option value="">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>

      {/* Reset Filters */}
      {onResetFilters && (
        <div className="filter-group">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onResetFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
