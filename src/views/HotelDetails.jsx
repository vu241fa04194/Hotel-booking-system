import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import RoomCard from '../components/RoomCard';

/**
 * HotelDetails View
 * Displays detailed information about a selected hotel,
 * available room counts, and room inventory with an "Available Rooms Only" filter.
 */
const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelAndRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call services in parallel
        const [hotelData, roomsData] = await Promise.all([
          hotelService.getHotelById(id),
          roomService.getRoomsByHotelId(id)
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        setError(err.message || 'Failed to load hotel details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelAndRooms();
    }
  }, [id]);

  if (loading) {
    return <p className="alert alert-info">Loading hotel details...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="alert alert-error">{error}</p>
        <Link to="/hotels" className="btn btn-secondary">
          ← Back to Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div>
        <p className="alert alert-info">Hotel not found.</p>
        <Link to="/hotels" className="btn btn-secondary">
          ← Back to Hotels
        </Link>
      </div>
    );
  }

  // Calculate live available rooms count for this hotel
  const availableRoomsCount = rooms.filter(
    (r) => r.status === 'available' || r.isAvailable === true
  ).length;

  // Filter rooms based on the "Show Available Rooms Only" toggle
  const displayedRooms = showAvailableOnly
    ? rooms.filter((r) => r.status === 'available' || r.isAvailable === true)
    : rooms;

  return (
    <div>
      <div className="mb-1">
        <Link to="/hotels" className="btn btn-secondary">
          ← Back to Hotels
        </Link>
      </div>

      <div className="hotel-card hotel-details-card">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-image hotel-details-image"
        />
        <div className="hotel-content">
          <div className="hotel-header">
            <h1 className="hotel-title">{hotel.name}</h1>
            <span className="hotel-rating">★ {hotel.rating}</span>
          </div>

          <p className="hotel-location">📍 {hotel.location}</p>

          <p className={`hotel-available-rooms ${availableRoomsCount > 0 ? 'text-available' : 'text-booked'}`}>
            🛏️ {availableRoomsCount > 0 ? `${availableRoomsCount} rooms available` : '0 rooms available (Fully Booked)'}
          </p>

          <p className="hotel-desc">{hotel.description}</p>

          <p className="hotel-price">
            Starting from ₹{hotel.price ?? hotel.pricePerNight} <span className="hotel-price-unit">/ night</span>
          </p>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="hotel-amenities-section">
              <h3 className="amenities-heading">Hotel Amenities & Features</h3>
              <div className="amenities-badge-list">
                {hotel.amenities.map((item, index) => (
                  <span key={index} className="amenity-badge">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Available Rooms Section with Filter Toggle */}
      <div className="rooms-section-header">
        <div>
          <h2 className="page-title">Available Rooms</h2>
          <p className="page-subtitle">
            Showing {displayedRooms.length} of {rooms.length} total rooms ({availableRoomsCount} currently available)
          </p>
        </div>

        <div className="rooms-filter-control">
          <label className="available-toggle-label">
            <input
              type="checkbox"
              className="available-toggle-checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
            />
            <span>Show Available Rooms Only</span>
          </label>
        </div>
      </div>

      {displayedRooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛏️</div>
          <h3 className="empty-state-title">No rooms match your filter</h3>
          <p className="empty-state-text">
            {showAvailableOnly
              ? 'All rooms for this hotel are currently booked. Uncheck "Show Available Rooms Only" to view all room specifications.'
              : 'No rooms listed for this hotel currently.'}
          </p>
          {showAvailableOnly && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAvailableOnly(false)}
            >
              Show All Rooms
            </button>
          )}
        </div>
      ) : (
        <div className="room-grid">
          {displayedRooms.map((room) => (
            <RoomCard key={room.id} room={room} hotelId={hotel.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
