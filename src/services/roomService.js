import apiClient from './apiConfig';
import { handleAxiosError } from '../exception/apiException';

/**
 * Room Service
 * Encapsulates all API operations relating to hotel rooms.
 */
export const roomService = {
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
   * Update room availability status.
   * @param {string|number} id - Room ID
   * @param {boolean} isAvailable - Availability flag
   * @returns {Promise<Object>} Updated room details
   */
  async updateRoomAvailability(id, isAvailable) {
    try {
      const response = await apiClient.patch(`/rooms/${id}`, {
        isAvailable,
        status: isAvailable ? 'available' : 'booked'
      });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
};

export default roomService;
