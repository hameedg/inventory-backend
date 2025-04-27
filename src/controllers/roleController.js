const roleService = require('../services/roleService');
const { successResponse, notFoundResponse } = require('../utils/response');

/**
 * Get all roles
 */
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getAllRoles();
    return successResponse(res, 200, 'Roles retrieved successfully', roles);
  } catch (error) {
    next(error);
  }
};

/**
 * Get role by ID
 */
const getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    
    if (!role) {
      return notFoundResponse(res, 'Role not found');
    }
    
    return successResponse(res, 200, 'Role retrieved successfully', role);
  } catch (error) {
    next(error);
  }
};

/**
 * Create role
 */
const createRole = async (req, res, next) => {
  try {
    const roleData = req.body;
    const role = await roleService.createRole(roleData);
    return successResponse(res, 201, 'Role created successfully', role);
  } catch (error) {
    next(error);
  }
};

/**
 * Update role
 */
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const roleData = req.body;
    
    const updatedRole = await roleService.updateRole(id, roleData);
    
    if (!updatedRole) {
      return notFoundResponse(res, 'Role not found');
    }
    
    return successResponse(res, 200, 'Role updated successfully', updatedRole);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete role
 */
const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await roleService.deleteRole(id);
    
    if (!result) {
      return notFoundResponse(res, 'Role not found');
    }
    
    return successResponse(res, 200, 'Role deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};