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
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="hotel-amenities">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="amenity-tag-more">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
        <div className="hotel-footer">
          <div>
            <span className="hotel-price">₹{hotel.pricePerNight}</span>
            <span className="hotel-price-unit"> / night</span>
          </div>
          <div className="card-actions">
            <Link to={`/hotel/${hotel.id}`} className="btn btn-secondary">
              View Details
            </Link>
            <Link to={`/hotel/${hotel.id}`} className="btn btn-primary">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
