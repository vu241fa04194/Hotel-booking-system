import apiClient from './apiConfig';
import { handleAxiosError } from '../exception/apiException';

/**
 * Hotel Service
 * Encapsulates all API operations relating to hotels.
 */
export const hotelService = {
  /**
   * Fetch all hotels, optionally filtered by search query parameters.
   * @param {Object} params - Query parameters (e.g. { location, q })
   * @returns {Promise<Array>} List of hotels
   */
  async getAllHotels(params = {}) {
    try {
      const response = await apiClient.get('/hotels', { params });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  /**
   * Fetch a single hotel by its unique identifier.
   * @param {string|number} id - Hotel ID
   * @returns {Promise<Object>} Hotel details
   */
  async getHotelById(id) {
    try {
      const response = await apiClient.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
};

export default hotelService;
