const authService = require('../services/authService');
const { successResponse, errorResponse, unauthorizedResponse } = require('../utils/response');

/**
 * User registration controller
 */
const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await authService.registerUser(userData);
    return successResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * User login controller
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return errorResponse(res, 400, 'Username and password are required');
    }
    
    const result = await authService.loginUser(username, password);
    
    if (!result.success) {
      return unauthorizedResponse(res, result.message);
    }
    
    return successResponse(res, 200, 'Login successful', result.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Remove sensitive information
    const userData = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.role_name,
        description: role.role_desc
      }))
    };
    
    return successResponse(res, 200, 'User profile retrieved successfully', userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};