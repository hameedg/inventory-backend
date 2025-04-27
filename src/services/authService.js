const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {object} Created user data
 */
const registerUser = async (userData) => {
  const { username, password, firstname, lastname, email, mobile, roleIds = [] } = userData;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user transaction
  const transaction = await db.sequelize.transaction();
  
  try {
    // Create user
    const user = await db.User.create({
      username,
      password: hashedPassword,
      firstname,
      lastname,
      email,
      mobile
    }, { transaction });
    
    // Assign roles if provided
    if (roleIds.length > 0) {
      const roles = await db.Role.findAll({
        where: {
          id: roleIds
        }
      });
      
      if (roles.length > 0) {
        await user.setRoles(roles, { transaction });
      }
    } else {
      // Assign default user role if exists
      const defaultRole = await db.Role.findOne({
        where: {
          role_name: 'user'
        }
      });
      
      if (defaultRole) {
        await user.addRole(defaultRole, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Return user without password
    const result = user.toJSON();
    delete result.password;
    
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Login user and generate token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {object} Login result with token
 */
const loginUser = async (username, password) => {
  // Find user by username
  const user = await db.User.findOne({
    where: {
      username
    },
    include: [{
      model: db.Role,
      as: 'roles'
    }]
  });
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
  
  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  // User data without password
  const userData = user.toJSON();
  delete userData.password;
  
  return {
    success: true,
    data: {
      user: userData,
      token
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};