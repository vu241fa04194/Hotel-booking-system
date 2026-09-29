import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import RoomCard from '../components/RoomCard';

/**
 * HotelDetails View
 * Displays detailed information about a selected hotel and its available rooms.
 */
const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
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
        <Link to="/" className="btn btn-secondary">
          ← Back to Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div>
        <p className="alert alert-info">Hotel not found.</p>
        <Link to="/" className="btn btn-secondary">
          ← Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1">
        <Link to="/" className="btn btn-secondary">
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
          <p className="hotel-desc">{hotel.description}</p>
          <p className="hotel-price">
            Starting from ₹{hotel.pricePerNight} <span className="hotel-price-unit">/ night</span>
          </p>
        </div>
      </div>

      <div className="page-header">
        <h2 className="page-title">Available Rooms</h2>
        <p className="page-subtitle">Choose the room type that best suits your stay.</p>
      </div>

      {rooms.length === 0 ? (
        <p className="alert alert-info">No rooms listed for this hotel currently.</p>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} hotelId={hotel.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
