import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import { ValidationException } from '../exception/validationException';

/**
 * Booking View
 * Handles the room reservation process and submits booking data.
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

      // Business & Payload Validation using ValidationException
      if (!hotelId || !roomId) {
        throw new ValidationException('Invalid hotel or room reference.');
      }
      if (!formData.guestName || !formData.guestEmail || !formData.checkIn || !formData.checkOut) {
        throw new ValidationException('All reservation fields are required.');
      }

      // Calculate days difference
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const totalPrice = nights * (room?.price || 0);

      const bookingPayload = {
        hotelId,
        hotelName: hotel?.name || 'Unknown Hotel',
        roomId,
        roomType: room?.type || 'Standard',
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        totalPrice,
        status: 'Confirmed'
      };

      // Service call (No direct Axios in view)
      await bookingService.createBooking(bookingPayload);
      navigate('/history');
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

  if (error && (!hotel || !room)) {
    return (
      <div>
        <p className="alert alert-error">{error}</p>
        <Link to="/" className="btn btn-secondary">
          ← Back to Hotels
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
          Booking <strong>{room?.type}</strong> at <strong>{hotel?.name}</strong> ({hotel?.location})
        </p>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <BookingForm onSubmit={handleBookingSubmit} isLoading={submitting} />
    </div>
  );
};

export default Booking;
