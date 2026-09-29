import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';

/**
 * BookingHistory View
 * Displays past and upcoming bookings made by the user.
 */
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;

    try {
      await bookingService.cancelBooking(id);
      // Refresh list
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Booking History</h1>
        <p className="page-subtitle">Review your current reservations and past bookings.</p>
      </div>

      {loading && <p className="alert alert-info">Loading bookings...</p>}
      {error && <p className="alert alert-error">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div>
          <p className="alert alert-info">No bookings found yet.</p>
          <Link to="/" className="btn btn-primary">
            Explore Hotels
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Guest</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td><strong>{booking.hotelName}</strong></td>
                  <td>{booking.roomType}</td>
                  <td>{booking.guestName}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td>₹{booking.totalPrice}</td>
                  <td>
                    <span
                      className={`booking-status ${
                        booking.status === 'Confirmed'
                          ? 'status-confirmed'
                          : 'status-cancelled'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
