import React from 'react';
import { Link } from 'react-router-dom';

/**
 * HotelCard Component
 * Displays a summary card for a hotel with details and navigation link.
 *
 * @param {Object} props
 * @param {Object} props.hotel - Hotel data object
 */
const HotelCard = ({ hotel }) => {
  if (!hotel) return null;

  return (
    <article className="hotel-card">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="hotel-image"
        loading="lazy"
      />
      <div className="hotel-content">
        <div className="hotel-header">
          <h3 className="hotel-title">{hotel.name}</h3>
          <span className="hotel-rating">★ {hotel.rating}</span>
        </div>
        <p className="hotel-location">📍 {hotel.location}</p>
        <p className="hotel-desc">{hotel.description}</p>
        <div className="hotel-footer">
          <div>
            <span className="hotel-price">₹{hotel.pricePerNight}</span>
            <span className="hotel-price-unit"> / night</span>
          </div>
          <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
