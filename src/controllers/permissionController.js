const permissionService = require('../services/permissionService');
const { successResponse, notFoundResponse } = require('../utils/response');

/**
 * Get all permissions
 */
const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    return successResponse(res, 200, 'Permissions retrieved successfully', permissions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get permission by ID
 */
const getPermissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await permissionService.getPermissionById(id);
    
    if (!permission) {
      return notFoundResponse(res, 'Permission not found');
    }
    
    return successResponse(res, 200, 'Permission retrieved successfully', permission);
  } catch (error) {
    next(error);
  }
};

/**
 * Create permission
 */
const createPermission = async (req, res, next) => {
  try {
    const permissionData = req.body;
    const permission = await permissionService.createPermission(permissionData);
    return successResponse(res, 201, 'Permission created successfully', permission);
  } catch (error) {
    next(error);
  }
};

/**
 * Update permission
 */
const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permissionData = req.body;
    
    const updatedPermission = await permissionService.updatePermission(id, permissionData);
    
    if (!updatedPermission) {
      return notFoundResponse(res, 'Permission not found');
    }
    
    return successResponse(res, 200, 'Permission updated successfully', updatedPermission);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete permission
 */
const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await permissionService.deletePermission(id);
    
    if (!result) {
      return notFoundResponse(res, 'Permission not found');
    }
    
    return successResponse(res, 200, 'Permission deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};