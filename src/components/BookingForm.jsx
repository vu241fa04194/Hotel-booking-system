import React, { useState } from 'react';

/**
 * BookingForm Component
 * Collects guest details and dates for confirming a hotel booking.
 * Note: Pure UI component. Does not contain Axios calls directly.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Function called on valid submission
 * @param {boolean} props.isLoading - Submission loading state
 */
const BookingForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    checkIn: '',
    checkOut: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for field being edited
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
      onSubmit(formData);
    }
  };

  return (
    <form className="booking-card" onSubmit={handleSubmit} noValidate>
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

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
