/**
 * ValidationException
 * Custom error class for business and form validation failures.
 * Used when user input violates requirements before or during submission.
 */
export class ValidationException extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationException';
    this.errors = errors; // Map of field names to specific error messages
  }
}
