require('dotenv').config();

const num = (v, d) => (v != null && v !== '' ? parseInt(v, 10) : d);

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 5000),
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  logLevel: process.env.LOG_LEVEL || 'info',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini-crm',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  corsOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  seedPassword: process.env.SEED_PASSWORD || 'Password123',
};

module.exports = env;
