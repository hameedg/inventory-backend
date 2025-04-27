const userService = require('../services/userService');
const { successResponse, notFoundResponse } = require('../utils/response');

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      return notFoundResponse(res, 'User not found');
    }
    
    return successResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const updatedUser = await userService.updateUser(id, userData);
    
    if (!updatedUser) {
      return notFoundResponse(res, 'User not found');
    }
    
    return successResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    
    if (!result) {
      return notFoundResponse(res, 'User not found');
    }
    
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};