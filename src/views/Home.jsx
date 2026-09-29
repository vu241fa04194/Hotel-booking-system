import React, { useState, useEffect } from 'react';
import hotelService from '../services/hotelService';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import HotelCard from '../components/HotelCard';

/**
 * Home View
 * Displays the hotel search, filters, and list of available hotels.
 */
const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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

  // Filter and sort logic
  const filteredHotels = hotels
    .filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation
        ? hotel.location.toLowerCase() === selectedLocation.toLowerCase()
        : true;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (selectedSort === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (selectedSort === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (selectedSort === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  // Extract unique locations dynamically for filter options
  const uniqueLocations = Array.from(
    new Set(hotels.map((h) => h.location).filter(Boolean))
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Find Your Next Stay</h1>
        <p className="page-subtitle">
          Search luxury hotels, cozy resorts, and budget rooms across top destinations.
        </p>
      </div>

      <div className="toolbar-container">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Filter
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          locations={uniqueLocations}
        />
      </div>

      {loading && <p className="alert alert-info">Loading available hotels...</p>}

      {error && <p className="alert alert-error">{error}</p>}

      {!loading && !error && filteredHotels.length === 0 && (
        <p className="alert alert-info">No hotels found matching your criteria.</p>
      )}

      <div className="hotel-grid">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Home;
