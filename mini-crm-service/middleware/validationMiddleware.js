const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (chains = []) => [
  ...chains,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return next(ApiError.badRequest('Validation failed', result.array()));
    next();
  },
];

module.exports = { validate };
