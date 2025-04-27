const db = require('../models');

/**
 * Get all permissions
 * @returns {Array} List of permissions
 */
const getAllPermissions = async () => {
  const permissions = await db.Permission.findAll({
    include: [{
      model: db.Permission,
      as: 'children',
      attributes: ['id', 'perm_name', 'perm_desc']
    }]
  });
  
  return permissions;
};

/**
 * Get permission by ID
 * @param {string} id - Permission ID
 * @returns {object} Permission data
 */
const getPermissionById = async (id) => {
  const permission = await db.Permission.findByPk(id, {
    include: [{
      model: db.Permission,
      as: 'children',
      attributes: ['id', 'perm_name', 'perm_desc']
    }]
  });
  
  return permission;
};

/**
 * Create permission
 * @param {object} permissionData - Permission data
 * @returns {object} Created permission
 */
const createPermission = async (permissionData) => {
  const { perm_name, perm_desc, parent_id } = permissionData;
  
  const permission = await db.Permission.create({
    perm_name,
    perm_desc,
    parent_id,
    created_at: new Date(),
    updated_at: new Date()
  });
  
  // Get permission with children
  const createdPermission = await getPermissionById(permission.id);
  return createdPermission;
};

/**
 * Update permission
 * @param {string} id - Permission ID
 * @param {object} permissionData - Permission data to update
 * @returns {object} Updated permission
 */
const updatePermission = async (id, permissionData) => {
  const permission = await db.Permission.findByPk(id);
  
  if (!permission) {
    return null;
  }
  
  const updateData = { 
    ...permissionData,
    updated_at: new Date()
  };
  
  await permission.update(updateData);
  
  // Get updated permission with children
  const updatedPermission = await getPermissionById(id);
  return updatedPermission;
};

/**
 * Delete permission
 * @param {string} id - Permission ID
 * @returns {boolean} Deletion success
 */
const deletePermission = async (id) => {
  const permission = await db.Permission.findByPk(id);
  
  if (!permission) {
    return false;
  }
  
  await permission.destroy();
  return true;
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
};