import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RoomCard Component
 * Displays available room types and booking button.
 *
 * @param {Object} props
 * @param {Object} props.room - Room details object
 * @param {string|number} props.hotelId - Hotel ID to which the room belongs
 */
const RoomCard = ({ room, hotelId }) => {
  if (!room) return null;

  return (
    <article className="room-card">
      <div className="hotel-header">
        <h4 className="room-title">{room.type}</h4>
        <span
          className={`room-badge ${
            room.isAvailable ? 'badge-available' : 'badge-unavailable'
          }`}
        >
          {room.isAvailable ? 'Available' : 'Booked'}
        </span>
      </div>
      <p className="room-meta">Room No: {room.roomNumber}</p>
      <p className="room-meta">Capacity: Up to {room.capacity} Guests</p>
      <div className="hotel-footer">
        <div>
          <span className="hotel-price">₹{room.price}</span>
          <span className="hotel-price-unit"> / night</span>
        </div>
        {room.isAvailable && (
          <Link
            to={`/booking?hotelId=${hotelId}&roomId=${room.id}`}
            className="btn btn-primary"
          >
            Book Room
          </Link>
        )}
      </div>
    </article>
  );
};

export default RoomCard;
