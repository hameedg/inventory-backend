const { testConnection } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Health check controller to test API and database connections
 */
const pingService = async (req, res, next) => {
  try {
    // Test database connection
    const dbStatus = await testConnection();
    
    // Current environment
    const env = process.env.NODE_ENV || 'development';
    
    // System info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    return successResponse(res, 200, 'Service is running', {
      timestamp: new Date().toISOString(),
      environment: env,
      database: {
        connected: dbStatus,
        status: dbStatus ? 'healthy' : 'unhealthy'
      },
      api: {
        status: 'healthy'
      },
      system: systemInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pingService
};