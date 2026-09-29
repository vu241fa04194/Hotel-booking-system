import apiClient from './apiConfig';
import { handleAxiosError } from '../exception/apiException';

/**
 * Room Service
 * Encapsulates all API operations relating to hotel rooms.
 */
export const roomService = {
  /**
   * Fetch all rooms across all hotels.
   * Used for calculating available room counts on hotel listings.
   * @returns {Promise<Array>} List of all rooms
   */
  async getAllRooms() {
    try {
      const response = await apiClient.get('/rooms');
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Fetch all rooms belonging to a specific hotel.
   * @param {string|number} hotelId - Hotel ID
   * @returns {Promise<Array>} List of rooms
   */
  async getRoomsByHotelId(hotelId) {
    try {
      const response = await apiClient.get('/rooms', {
        params: { hotelId }
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Fetch only available rooms for a specific hotel.
   * @param {string|number} hotelId - Hotel ID
   * @returns {Promise<Array>} List of available rooms
   */
  async getAvailableRoomsByHotelId(hotelId) {
    try {
      const response = await apiClient.get('/rooms', {
        params: { hotelId, status: 'available' }
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Fetch room details by room ID.
   * @param {string|number} id - Room ID
   * @returns {Promise<Object>} Room details
   */
  async getRoomById(id) {
    try {
      const response = await apiClient.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Update room availability status using a boolean flag.
   * @param {string|number} id - Room ID
   * @param {boolean} isAvailable - Availability flag
   * @returns {Promise<Object>} Updated room details
   */
  async updateRoomAvailability(id, isAvailable) {
    try {
      const status = isAvailable ? 'available' : 'booked';
      const response = await apiClient.patch(`/rooms/${id}`, {
        isAvailable,
        status
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Update room status directly ('available' or 'booked').
   * @param {string|number} id - Room ID
   * @param {string} status - 'available' | 'booked'
   * @returns {Promise<Object>} Updated room details
   */
  async updateRoomStatus(id, status) {
    try {
      const isAvailable = status === 'available';
      const response = await apiClient.patch(`/rooms/${id}`, {
        status,
        isAvailable
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
};

export default roomService;
