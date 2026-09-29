import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RoomCard Component
 * Displays room details, live availability indicator (🟢 Available / 🔴 Booked),
 * and the appropriate action trigger (Book Now / Not Available).
 *
 * @param {Object} props
 * @param {Object} props.room - Room details object
 * @param {string|number} props.hotelId - Hotel ID to which the room belongs
 */
const RoomCard = ({ room, hotelId }) => {
  if (!room) return null;

  const roomTitle = room.roomType ?? room.type ?? 'Standard Room';
  const isAvailable = room.status === 'available' || room.isAvailable === true;

  return (
    <article className={`room-card ${isAvailable ? 'room-card-available' : 'room-card-booked'}`}>
      <div className="room-card-top">
        <h4 className="room-title">{roomTitle}</h4>
        <span
          className={`room-status-indicator ${
            isAvailable ? 'status-indicator-available' : 'status-indicator-booked'
          }`}
        >
          {isAvailable ? '🟢 Available' : '🔴 Booked'}
        </span>
      </div>

      <p className="room-meta room-number">Room {room.roomNumber}</p>
      <p className="room-meta">Capacity: Up to {room.capacity || 2} Guests</p>

      <div className="hotel-footer room-card-footer">
        <div>
          <span className="hotel-price">₹{room.price}</span>
          <span className="hotel-price-unit"> / night</span>
        </div>

        {isAvailable ? (
          <Link
            to={`/booking?hotelId=${hotelId}&roomId=${room.id}`}
            className="btn btn-primary"
          >
            Book Now
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-disabled"
            disabled
            title="This room is currently booked"
          >
            Not Available
          </button>
        )}
      </div>
    </article>
  );
};

export default RoomCard;
