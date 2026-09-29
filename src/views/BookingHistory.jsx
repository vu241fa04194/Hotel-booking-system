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

  const [actionLoadingId, setActionLoadingId] = useState(null);

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
      setActionLoadingId(id);
      const updated = await bookingService.cancelBooking(id);
      // Update status in local state to reflect cancellation immediately
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm('Permanently delete this booking record?');
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      await bookingService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete booking record.');
    } finally {
      setActionLoadingId(null);
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
                <th>Actions</th>
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
                    <div className="table-actions">
                      {booking.status !== 'Cancelled' ? (
                        <button
                          type="button"
                          className="btn btn-warning"
                          disabled={actionLoadingId === booking.id}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {actionLoadingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={actionLoadingId === booking.id}
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          {actionLoadingId === booking.id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
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
