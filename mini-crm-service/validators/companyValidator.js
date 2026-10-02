const { body, param } = require('express-validator');

const createRules = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('industry').trim().notEmpty().withMessage('Industry is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

const idParam = [param('id').isMongoId()];

module.exports = { createRules, idParam };
