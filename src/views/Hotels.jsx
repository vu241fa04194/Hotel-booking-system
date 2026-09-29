import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import HotelCard from '../components/HotelCard';

/**
 * Hotels View
 * Dedicated hotel catalog page with search, filters (location, price, rating,
 * room availability), sorting, and responsive hotel cards.
 */
const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlLocation = searchParams.get('location') || '';

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync selectedLocation whenever the URL search param changes
  useEffect(() => {
    setSelectedLocation(urlLocation);
  }, [urlLocation]);

  // Fetch hotels and rooms data via dedicated services
  useEffect(() => {
    const fetchHotelsAndRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const [hotelsData, roomsData] = await Promise.all([
          hotelService.getAllHotels(),
          roomService.getAllRooms()
        ]);
        setHotels(hotelsData);
        setRooms(roomsData);
      } catch (err) {
        setError(err.message || 'Failed to load hotels. Please ensure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsAndRooms();
  }, []);

  // Reset all active filters and clean up URL query params
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setOnlyAvailable(false);
    setSelectedSort('');
    setSearchParams({});
  };

  // Derive unique location names from hotel records
  const uniqueLocations = Array.from(
    new Set(hotels.map((h) => h.location).filter(Boolean))
  ).sort();

  // Multi-factor filtering & sorting
  const filteredHotels = hotels
    .filter((hotel) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query
        ? hotel.name.toLowerCase().includes(query) ||
          hotel.location.toLowerCase().includes(query)
        : true;

      // Handle location matching, including common variations (e.g. Bangalore / Bengaluru, Delhi / New Delhi)
      let matchesLocation = true;
      if (selectedLocation) {
        const sel = selectedLocation.toLowerCase().trim();
        const loc = hotel.location.toLowerCase().trim();
        const name = hotel.name.toLowerCase().trim();
        matchesLocation =
          loc === sel ||
          loc.includes(sel) ||
          sel.includes(loc) ||
          name.includes(sel) ||
          (sel === 'bangalore' && loc === 'bengaluru') ||
          (sel === 'bengaluru' && loc === 'bangalore') ||
          (sel === 'delhi' && loc.includes('delhi'));
      }

      const hotelPrice = hotel.price ?? hotel.pricePerNight ?? 0;
      const matchesMinPrice = minPrice ? hotelPrice >= Number(minPrice) : true;
      const matchesMaxPrice = maxPrice ? hotelPrice <= Number(maxPrice) : true;
      const matchesRating = minRating ? hotel.rating >= Number(minRating) : true;

      // Available rooms calculation for availability filtering
      const hotelRooms = rooms.filter(
        (r) => String(r.hotelId) === String(hotel.id)
      );
      const availableRoomsCount = hotelRooms.filter(
        (r) => r.status === 'available' || r.isAvailable === true
      ).length;

      const matchesAvailable = onlyAvailable ? availableRoomsCount > 0 : true;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating &&
        matchesAvailable
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
    <div className="hotels-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Explore Hotels</h1>
        <p className="page-subtitle">Find the perfect hotel for your stay.</p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="toolbar-container">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Filter
          selectedLocation={selectedLocation}
          onLocationChange={(loc) => {
            setSelectedLocation(loc);
            if (loc) {
              setSearchParams({ location: loc });
            } else {
              setSearchParams({});
            }
          }}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={setOnlyAvailable}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          locations={uniqueLocations}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Loading & Error States */}
      {loading && <p className="alert alert-info">Loading hotels...</p>}
      {error && <p className="alert alert-error">{error}</p>}

      {/* Results Header */}
      {!loading && !error && (
        <div className="section-header">
          <p className="section-subtitle">
            Showing {filteredHotels.length} of {hotels.length} hotels
            {selectedLocation && ` in "${selectedLocation}"`}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredHotels.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏨</div>
          <h3 className="empty-state-title">No hotels found.</h3>
          <p className="empty-state-text">
            No properties match your current search and filter settings. Try adjusting your filters or search keywords.
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

      {/* Responsive Hotels Grid */}
      <div className="hotel-grid">
        {filteredHotels.map((hotel) => {
          const hotelRooms = rooms.filter(
            (r) => String(r.hotelId) === String(hotel.id)
          );
          const availableRoomsCount = hotelRooms.filter(
            (r) => r.status === 'available' || r.isAvailable === true
          ).length;

          return (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              availableRoomsCount={availableRoomsCount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Hotels;
