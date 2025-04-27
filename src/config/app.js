require('dotenv').config();

module.exports = {
  // Server config
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // JWT config
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // Logging config
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  },
  
  // Cors config
  cors: {
    origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  
  // Rate limiting (for production)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};