/**
 * ApiException
 * Custom error class for API and HTTP communication failures.
 * Used across service layers to standardize error responses for UI components.
 */
export class ApiException extends Error {
  constructor(message, statusCode = null, details = null) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Helper utility to normalize Axios errors into ApiException.
 * Makes it easy to handle in UI components and explain in a viva.
 *
 * @param {Error} error - Axios error object
 * @returns {ApiException} Standardized exception
 */
export const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with a status code out of 2xx range
    const message = error.response.data?.message || `Server error with status: ${error.response.status}`;
    return new ApiException(message, error.response.status, error.response.data);
  } else if (error.request) {
    // Request was made but no response was received (e.g. JSON server not running)
    return new ApiException(
      'Cannot connect to backend server. Make sure JSON Server is running on port 5000.',
      0
    );
  } else {
    // Something happened setting up the request
    return new ApiException(error.message || 'An unexpected network error occurred.');
  }
};
