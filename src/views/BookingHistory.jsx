import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import roomService from '../services/roomService';

/**
 * BookingHistory View
 * Displays all user bookings with reservation details,
 * supports booking cancellation and automated room availability restoration.
 */
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
      setError(null);
      setSuccessMessage(null);

      const targetBooking = bookings.find((b) => b.id === id);

      // 1. Update booking status to Cancelled
      await bookingService.cancelBooking(id);

      // 2. Restore room availability in JSON Server (isAvailable: true)
      if (targetBooking?.roomId) {
        try {
          await roomService.updateRoomAvailability(targetBooking.roomId, true);
        } catch (roomErr) {
          console.warn('Room availability update notice:', roomErr);
        }
      }

      // 3. Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );

      setSuccessMessage(`Booking #${id} has been cancelled. The room is now available for new reservations.`);
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm('Permanently delete this cancelled booking record?');
    if (!confirmed) return;

    try {
      setActionLoadingId(id);
      setError(null);
      await bookingService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSuccessMessage(`Booking #${id} record permanently removed.`);
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
        <p className="page-subtitle">Review your active reservations and past bookings.</p>
      </div>

      {loading && <p className="alert alert-info">Loading bookings...</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {successMessage && <p className="alert alert-success">{successMessage}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No bookings found</h3>
          <p className="empty-state-text">You have not made any hotel reservations yet.</p>
          <Link to="/" className="btn btn-primary">
            Explore Hotels & Book Now
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Hotel Name</th>
                <th>Room</th>
                <th>Guest</th>
                <th>Guests</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Amount</th>
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
                  <td>{booking.guests || 1}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td><strong>₹{booking.totalPrice}</strong></td>
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
