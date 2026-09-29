import apiClient from './apiConfig';
import { handleAxiosError } from '../exception/apiException';

/**
 * Booking Service
 * Encapsulates all API operations relating to customer bookings.
 */
export const bookingService = {
  /**
   * Fetch all bookings history.
   * @returns {Promise<Array>} List of bookings
   */
  async getAllBookings() {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Fetch a single booking by ID.
   * @param {string|number} id - Booking ID
   * @returns {Promise<Object>} Booking details
   */
  async getBookingById(id) {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Create a new hotel booking.
   * @param {Object} bookingData - Booking details (guest info, dates, hotel/room)
   * @returns {Promise<Object>} Created booking record
   */
  async createBooking(bookingData) {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Cancel or delete a booking by ID.
   * @param {string|number} id - Booking ID
   * @returns {Promise<Object>} Response confirmation
   */
  async cancelBooking(id) {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
};

export default bookingService;
