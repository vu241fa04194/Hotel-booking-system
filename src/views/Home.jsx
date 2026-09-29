import React, { useState, useEffect } from 'react';
import hotelService from '../services/hotelService';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import HotelCard from '../components/HotelCard';

/**
 * Home View
 * Provides a hero banner, full search/filter toolbar, and the "Explore Hotels" catalog.
 */
const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotels using hotelService (No direct Axios in components)
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getAllHotels();
        setHotels(data);
      } catch (err) {
        setError(err.message || 'Failed to load hotels. Please ensure JSON server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSelectedSort('');
  };

  // Derive unique locations dynamically from hotels
  const uniqueLocations = Array.from(
    new Set(hotels.map((h) => h.location).filter(Boolean))
  );

  // Comprehensive multi-factor filtering & sorting
  const filteredHotels = hotels
    .filter((hotel) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query
        ? hotel.name.toLowerCase().includes(query) ||
          hotel.location.toLowerCase().includes(query)
        : true;

      const matchesLocation = selectedLocation
        ? hotel.location.toLowerCase() === selectedLocation.toLowerCase()
        : true;

      const hotelPrice = hotel.price ?? hotel.pricePerNight ?? 0;

      const matchesMinPrice = minPrice
        ? hotelPrice >= Number(minPrice)
        : true;

      const matchesMaxPrice = maxPrice
        ? hotelPrice <= Number(maxPrice)
        : true;

      const matchesRating = minRating
        ? hotel.rating >= Number(minRating)
        : true;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating
      );
    })
    .sort((a, b) => {
      const priceA = a.price ?? a.pricePerNight ?? 0;
      const priceB = b.price ?? b.pricePerNight ?? 0;
      if (selectedSort === 'price-asc') return priceA - priceB;
      if (selectedSort === 'price-desc') return priceB - priceA;
      if (selectedSort === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  return (
    <div>
      {/* Hero Section with Large Search */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Welcome to HotelStay</span>
          <h1 className="hero-title">Find & Book Your Perfect Stay</h1>
          <p className="hero-subtitle">
            Explore top-rated luxury resorts, cozy mountain retreats, and seaside villas.
          </p>
          <div className="hero-search-box">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </section>

      {/* Explore Hotels Section */}
      <section id="explore" className="explore-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Hotels</h2>
            <p className="section-subtitle">
              Showing {filteredHotels.length} of {hotels.length} available properties
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="toolbar-container">
          <Filter
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            locations={uniqueLocations}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Loading & Error States */}
        {loading && <p className="alert alert-info">Loading available hotels...</p>}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Empty State */}
        {!loading && !error && filteredHotels.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No hotels found</h3>
            <p className="empty-state-text">
              We couldn't find any hotels matching your current search or filter criteria.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Hotels Responsive Grid */}
        <div className="hotel-grid">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
