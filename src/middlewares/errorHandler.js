const { errorResponse } = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = {};
  
  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({ field: e.path, message: e.message }));
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token Expired';
  }
  
  // Custom API error
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || {};
  }
  
  return errorResponse(res, statusCode, message, errors);
};

module.exports = errorHandler;