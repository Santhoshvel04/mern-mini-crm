const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => { // eslint-disable-line
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Invalid id' },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: err.message },
    });
  }

  logger.error(`[unhandled] ${err.stack || err.message}`);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL', message: isDev ? err.message : 'Internal server error' },
  });
};
