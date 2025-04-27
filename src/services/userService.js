const bcrypt = require('bcrypt');
const db = require('../models');

/**
 * Get all users
 * @returns {Array} List of users
 */
const getAllUsers = async () => {
  const users = await db.User.findAll({
    attributes: { exclude: ['password'] },
    include: [{
      model: db.Role,
      as: 'roles',
      attributes: ['id', 'role_name', 'role_desc']
    }]
  });
  
  return users;
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {object} User data
 */
const getUserById = async (id) => {
  const user = await db.User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: db.Role,
      as: 'roles',
      attributes: ['id', 'role_name', 'role_desc']
    }]
  });
  
  return user;
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {object} userData - User data to update
 * @returns {object} Updated user data
 */
const updateUser = async (id, userData) => {
  const { password, roleIds, ...otherData } = userData;
  
  const transaction = await db.sequelize.transaction();
  
  try {
    const user = await db.User.findByPk(id);
    
    if (!user) {
      await transaction.rollback();
      return null;
    }
    
    // Update basic user data
    const updateData = { ...otherData };
    
    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    await user.update(updateData, { transaction });
    
    // Update roles if provided
    if (roleIds && Array.isArray(roleIds)) {
      const roles = await db.Role.findAll({
        where: {
          id: roleIds
        }
      });
      
      await user.setRoles(roles, { transaction });
    }
    
    await transaction.commit();
    
    // Get updated user with roles
    const updatedUser = await getUserById(id);
    return updatedUser;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean} Deletion success
 */
const deleteUser = async (id) => {
  const user = await db.User.findByPk(id);
  
  if (!user) {
    return false;
  }
  
  await user.destroy();
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};