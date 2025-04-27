const jwt = require('jsonwebtoken');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/response');
const db = require('../models');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Get the token from headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'Authentication token is required');
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await db.User.findByPk(decoded.id, {
      include: [{
        model: db.Role,
        as: 'roles',
        include: [{
          model: db.Permission,
          as: 'permissions'
        }]
      }]
    });
    
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Token expired');
    }
    return unauthorizedResponse(res, 'Invalid token');
  }
};

/**
 * Middleware to check if user has required role
 * @param {string|string[]} roles - Required role(s)
 */
const hasRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return unauthorizedResponse(res, 'User not authenticated');
      }
      
      const userRoles = req.user.roles.map(role => role.role_name);
      
      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return forbiddenResponse(res, 'Insufficient role permissions');
      }
      
      next();
    } catch (error) {
      return forbiddenResponse(res, 'Role verification failed');
    }
  };
};

/**
 * Middleware to check if user has required permission
 * @param {string|string[]} permissions - Required permission(s)
 */
const hasPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return unauthorizedResponse(res, 'User not authenticated');
      }
      
      // Get all user permissions from their roles
      const userPermissions = [];
      req.user.roles.forEach(role => {
        role.permissions.forEach(perm => {
          userPermissions.push(perm.perm_name);
        });
      });
      
      // Remove duplicates
      const uniquePermissions = [...new Set(userPermissions)];
      
      const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
      
      const hasRequiredPermission = requiredPermissions.some(perm => 
        uniquePermissions.includes(perm)
      );
      
      if (!hasRequiredPermission) {
        return forbiddenResponse(res, 'Insufficient permissions');
      }
      
      next();
    } catch (error) {
      return forbiddenResponse(res, 'Permission verification failed');
    }
  };
};

module.exports = {
  authenticate,
  hasRole,
  hasPermission
};