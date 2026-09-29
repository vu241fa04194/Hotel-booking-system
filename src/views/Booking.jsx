import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import { ValidationException } from '../exception/validationException';

/**
 * Booking View
 * Handles the room reservation process, confirms booking,
 * and updates room availability via services.
 */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Booking confirmation state
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!hotelId || !roomId) {
        setError('Missing hotel or room selection. Please choose a room to book.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [hotelData, roomData] = await Promise.all([
          hotelService.getHotelById(hotelId),
          roomService.getRoomById(roomId)
        ]);

        const isRoomAvail = roomData.status === 'available' || roomData.isAvailable === true;
        if (!isRoomAvail) {
          setError('Sorry, this room is no longer available.');
        }

        setHotel(hotelData);
        setRoom(roomData);
      } catch (err) {
        setError(err.message || 'Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [hotelId, roomId]);

  const handleBookingSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Business & Payload Validation
      if (!hotelId || !roomId) {
        throw new ValidationException('Invalid hotel or room reference.');
      }
      if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
        throw new ValidationException('All reservation fields are required.');
      }

      // Check whether the room is currently available
      const latestRoom = await roomService.getRoomById(roomId);
      const isStillAvailable = latestRoom.status === 'available' || latestRoom.isAvailable === true;
      if (!isStillAvailable) {
        setRoom((prev) => ({ ...prev, status: 'booked', isAvailable: false }));
        throw new ValidationException('Sorry, this room is no longer available.');
      }

      const bookingPayload = {
        hotelId,
        hotelName: hotel?.name || 'Unknown Hotel',
        roomId,
        roomType: room?.roomType || room?.type || 'Standard',
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guests: formData.guests || 1,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice: formData.totalPrice,
        status: 'Confirmed'
      };

      // 1. Create booking in JSON Server
      const createdBooking = await bookingService.createBooking(bookingPayload);

      // 2. Change room status to "booked" and update state immediately
      await roomService.updateRoomStatus(roomId, 'booked');
      setRoom((prev) => ({ ...prev, status: 'booked', isAvailable: false }));

      // 3. Show booking confirmation
      setConfirmedBooking(createdBooking);
      setBookingSuccess(true);
    } catch (err) {
      if (err instanceof ValidationException) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to complete booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="alert alert-info">Preparing booking summary...</p>;
  }

  // Confirmation Success View
  if (bookingSuccess && confirmedBooking) {
    return (
      <div className="confirmation-card">
        <div className="confirmation-icon">🎉</div>
        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your reservation has been successfully placed and the room is reserved for you.
        </p>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Booking Reference:</span>
            <strong>#{confirmedBooking.id}</strong>
          </div>
          <div className="confirmation-row">
            <span>Hotel:</span>
            <strong>{confirmedBooking.hotelName}</strong>
          </div>
          <div className="confirmation-row">
            <span>Room:</span>
            <strong>{confirmedBooking.roomType}</strong>
          </div>
          <div className="confirmation-row">
            <span>Guest Name:</span>
            <span>{confirmedBooking.guestName}</span>
          </div>
          <div className="confirmation-row">
            <span>Guests:</span>
            <span>{confirmedBooking.guests} Guest(s)</span>
          </div>
          <div className="confirmation-row">
            <span>Dates:</span>
            <span>{confirmedBooking.checkIn} to {confirmedBooking.checkOut}</span>
          </div>
          <div className="confirmation-row total-row">
            <span>Total Paid:</span>
            <strong className="confirmation-price">₹{confirmedBooking.totalPrice}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/bookings')}
          >
            View in Booking History →
          </button>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isRoomBooked = room && room.status === 'booked' && !room.isAvailable;

  if (error && (!hotel || !room || isRoomBooked)) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h3 className="empty-state-title">Room Unavailable</h3>
        <p className="empty-state-text">{error || 'Sorry, this room is no longer available.'}</p>
        <Link to={hotelId ? `/hotel/${hotelId}` : '/'} className="btn btn-primary">
          ← View Available Rooms
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1">
        <Link to={`/hotel/${hotelId}`} className="btn btn-secondary">
          ← Back to Hotel Details
        </Link>
      </div>

      <div className="page-header">
        <h1 className="page-title">Complete Your Reservation</h1>
        <p className="page-subtitle">
          Reserving <strong>{room?.roomType || room?.type}</strong> at <strong>{hotel?.name}</strong> ({hotel?.location})
        </p>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <BookingForm
        onSubmit={handleBookingSubmit}
        isLoading={submitting}
        room={room}
        hotel={hotel}
      />
    </div>
  );
};

export default Booking;
