const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const permissionController = require('../controllers/permissionController');
const pingController = require('../controllers/pingController');

// Middlewares
const { authenticate, hasRole, hasPermission } = require('../middlewares/auth');

// Health check routes
router.get('/ping', pingController.pingService);

/**
 * Auth routes
 */
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);

/**
 * User routes
 */
router.get('/users', authenticate, hasPermission('users:read'), userController.getAllUsers);
router.get('/users/:id', authenticate, hasPermission('users:read'), userController.getUserById);
router.put('/users/:id', authenticate, hasPermission('users:update'), userController.updateUser);
router.delete('/users/:id', authenticate, hasPermission(['users:delete', 'admin']), userController.deleteUser);

/**
 * Role routes
 */
router.get('/roles', authenticate, hasPermission('roles:read'), roleController.getAllRoles);
router.get('/roles/:id', authenticate, hasPermission('roles:read'), roleController.getRoleById);
router.post('/roles', authenticate, hasPermission('roles:create'), roleController.createRole);
router.put('/roles/:id', authenticate, hasPermission('roles:update'), roleController.updateRole);
router.delete('/roles/:id', authenticate, hasPermission(['roles:delete', 'admin']), roleController.deleteRole);

/**
 * Permission routes
 */
router.get('/permissions', authenticate, hasPermission('permissions:read'), permissionController.getAllPermissions);
router.get('/permissions/:id', authenticate, hasPermission('permissions:read'), permissionController.getPermissionById);
router.post('/permissions', authenticate, hasPermission('permissions:create'), permissionController.createPermission);
router.put('/permissions/:id', authenticate, hasPermission('permissions:update'), permissionController.updatePermission);
router.delete('/permissions/:id', authenticate, hasPermission(['permissions:delete', 'admin']), permissionController.deletePermission);

module.exports = router;