const db = require('../models');

/**
 * Get all roles
 * @returns {Array} List of roles
 */
const getAllRoles = async () => {
  const roles = await db.Role.findAll({
    include: [{
      model: db.Permission,
      as: 'permissions',
      attributes: ['id', 'perm_name', 'perm_desc']
    }]
  });
  
  return roles;
};

/**
 * Get role by ID
 * @param {string} id - Role ID
 * @returns {object} Role data
 */
const getRoleById = async (id) => {
  const role = await db.Role.findByPk(id, {
    include: [{
      model: db.Permission,
      as: 'permissions',
      attributes: ['id', 'perm_name', 'perm_desc']
    }]
  });
  
  return role;
};

/**
 * Create role
 * @param {object} roleData - Role data
 * @returns {object} Created role
 */
const createRole = async (roleData) => {
  const { role_name, role_desc, permissionIds = [] } = roleData;
  
  const transaction = await db.sequelize.transaction();
  
  try {
    // Create role
    const role = await db.Role.create({
      role_name,
      role_desc,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });
    
    // Assign permissions if provided
    if (permissionIds.length > 0) {
      const permissions = await db.Permission.findAll({
        where: {
          id: permissionIds
        }
      });
      
      if (permissions.length > 0) {
        await role.setPermissions(permissions, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Get role with permissions
    const createdRole = await getRoleById(role.id);
    return createdRole;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Update role
 * @param {string} id - Role ID
 * @param {object} roleData - Role data to update
 * @returns {object} Updated role
 */
const updateRole = async (id, roleData) => {
  const { permissionIds, ...otherData } = roleData;
  
  const transaction = await db.sequelize.transaction();
  
  try {
    const role = await db.Role.findByPk(id);
    
    if (!role) {
      await transaction.rollback();
      return null;
    }
    
    // Update basic role data
    const updateData = { 
      ...otherData,
      updated_at: new Date()
    };
    
    await role.update(updateData, { transaction });
    
    // Update permissions if provided
    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await db.Permission.findAll({
        where: {
          id: permissionIds
        }
      });
      
      await role.setPermissions(permissions, { transaction });
    }
    
    await transaction.commit();
    
    // Get updated role with permissions
    const updatedRole = await getRoleById(id);
    return updatedRole;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Delete role
 * @param {string} id - Role ID
 * @returns {boolean} Deletion success
 */
const deleteRole = async (id) => {
  const role = await db.Role.findByPk(id);
  
  if (!role) {
    return false;
  }
  
  await role.destroy();
  return true;
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};