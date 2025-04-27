/**
 * Success response formatter
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object|array} data - Response data
 * @param {object} meta - Metadata like pagination
 * @returns {object} Formatted success response
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}, meta = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta
    });
  };
  
  /**
   * Error response formatter
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {object|array} errors - Error details
   * @returns {object} Formatted error response
   */
  const errorResponse = (res, statusCode = 500, message = 'Server Error', errors = {}) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  };
  
  /**
   * Not found response
   * @param {object} res - Express response object
   * @param {string} message - Not found message
   * @returns {object} 404 response
   */
  const notFoundResponse = (res, message = 'Resource not found') => {
    return errorResponse(res, 404, message);
  };
  
  /**
   * Bad request response
   * @param {object} res - Express response object
   * @param {string} message - Bad request message
   * @param {object|array} errors - Validation errors
   * @returns {object} 400 response
   */
  const badRequestResponse = (res, message = 'Bad request', errors = {}) => {
    return errorResponse(res, 400, message, errors);
  };
  
  /**
   * Unauthorized response
   * @param {object} res - Express response object
   * @param {string} message - Unauthorized message
   * @returns {object} 401 response
   */
  const unauthorizedResponse = (res, message = 'Unauthorized') => {
    return errorResponse(res, 401, message);
  };
  
  /**
   * Forbidden response
   * @param {object} res - Express response object
   * @param {string} message - Forbidden message
   * @returns {object} 403 response
   */
  const forbiddenResponse = (res, message = 'Forbidden') => {
    return errorResponse(res, 403, message);
  };
  
  module.exports = {
    successResponse,
    errorResponse,
    notFoundResponse,
    badRequestResponse,
    unauthorizedResponse,
    forbiddenResponse
  };