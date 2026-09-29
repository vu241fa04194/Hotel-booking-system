import React, { useState } from 'react';

/**
 * BookingForm Component
 * Collects guest details, guest count, and dates with live pricing calculation.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Function called on valid submission
 * @param {boolean} props.isLoading - Submission loading state
 * @param {Object} props.room - Selected room details
 * @param {Object} props.hotel - Selected hotel details
 */
const BookingForm = ({ onSubmit, isLoading = false, room, hotel }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [formErrors, setFormErrors] = useState({});

  // Compute stay duration and price
  const calculatePricing = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return { nights: 0, totalPrice: 0 };
    }
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    if (diffTime <= 0) {
      return { nights: 0, totalPrice: 0 };
    }
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = nights * (room?.price || 0);
    return { nights, totalPrice };
  };

  const { nights, totalPrice } = calculatePricing();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.guestName.trim()) {
      errors.guestName = 'Guest name is required.';
    }
    if (!formData.guestEmail.trim()) {
      errors.guestEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
      errors.guestEmail = 'Please enter a valid email address.';
    }
    if (!formData.checkIn) {
      errors.checkIn = 'Check-in date is required.';
    } else if (formData.checkIn < today) {
      errors.checkIn = 'Check-in date cannot be in the past.';
    }
    if (!formData.checkOut) {
      errors.checkOut = 'Check-out date is required.';
    } else if (formData.checkIn && formData.checkOut <= formData.checkIn) {
      errors.checkOut = 'Check-out date must be after check-in date.';
    }
    const guestCount = Number(formData.guests);
    if (!guestCount || guestCount < 1) {
      errors.guests = 'At least 1 guest is required.';
    } else if (room?.capacity && guestCount > room.capacity) {
      errors.guests = `This room accommodates a maximum of ${room.capacity} guests.`;
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (onSubmit) {
      onSubmit({
        ...formData,
        guests: Number(formData.guests),
        nights,
        totalPrice
      });
    }
  };

  return (
    <form className="booking-card" onSubmit={handleSubmit} noValidate>
      {/* Selected Room & Hotel Summary */}
      {room && hotel && (
        <div className="booking-summary-box">
          <div className="booking-summary-header">
            <h3 className="booking-summary-title">Reservation Summary</h3>
            <span className="room-badge badge-available">Selected Room</span>
          </div>
          <p className="summary-hotel">🏨 <strong>{hotel.name}</strong> ({hotel.location})</p>
          <p className="summary-room">🛏️ {room.type} • Room #{room.roomNumber}</p>
          <p className="summary-rate">Price: ₹{room.price} / night (Max capacity: {room.capacity} guests)</p>
        </div>
      )}

      {/* Guest Name */}
      <div className="form-group">
        <label htmlFor="guestName" className="form-label">
          Full Name
        </label>
        <input
          id="guestName"
          name="guestName"
          type="text"
          className="form-input"
          placeholder="e.g. John Doe"
          value={formData.guestName}
          onChange={handleChange}
        />
        {formErrors.guestName && (
          <p className="form-error">{formErrors.guestName}</p>
        )}
      </div>

      {/* Guest Email */}
      <div className="form-group">
        <label htmlFor="guestEmail" className="form-label">
          Email Address
        </label>
        <input
          id="guestEmail"
          name="guestEmail"
          type="email"
          className="form-input"
          placeholder="e.g. john@example.com"
          value={formData.guestEmail}
          onChange={handleChange}
        />
        {formErrors.guestEmail && (
          <p className="form-error">{formErrors.guestEmail}</p>
        )}
      </div>

      {/* Number of Guests */}
      <div className="form-group">
        <label htmlFor="guests" className="form-label">
          Number of Guests
        </label>
        <input
          id="guests"
          name="guests"
          type="number"
          min="1"
          max={room?.capacity || 10}
          className="form-input"
          value={formData.guests}
          onChange={handleChange}
        />
        {formErrors.guests && (
          <p className="form-error">{formErrors.guests}</p>
        )}
      </div>

      {/* Dates Grid */}
      <div className="dates-grid">
        <div className="form-group">
          <label htmlFor="checkIn" className="form-label">
            Check-In Date
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
            value={formData.checkIn}
            onChange={handleChange}
          />
          {formErrors.checkIn && (
            <p className="form-error">{formErrors.checkIn}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="checkOut" className="form-label">
            Check-Out Date
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            className="form-input"
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            value={formData.checkOut}
            onChange={handleChange}
          />
          {formErrors.checkOut && (
            <p className="form-error">{formErrors.checkOut}</p>
          )}
        </div>
      </div>

      {/* Real-time Calculation Breakdown */}
      <div className="price-breakdown">
        <div className="breakdown-row">
          <span>Stay Duration:</span>
          <strong>{nights > 0 ? `${nights} Night${nights > 1 ? 's' : ''}` : 'Select dates'}</strong>
        </div>
        <div className="breakdown-row">
          <span>Room Rate:</span>
          <span>₹{room?.price || 0} / night</span>
        </div>
        <div className="breakdown-row total-row">
          <span>Total Amount:</span>
          <span className="breakdown-total">₹{totalPrice}</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading || nights === 0}
        >
          {isLoading ? 'Processing Reservation...' : `Confirm & Book (₹${totalPrice})`}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
