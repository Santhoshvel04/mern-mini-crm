const { body, param, query } = require('express-validator');
const { LEAD_STATUSES } = require('../utils/constants');

const listRules = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(LEAD_STATUSES),
  query('search').optional().isString().trim(),
];

const upsertRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString().trim(),
  body('status').isIn(LEAD_STATUSES).withMessage('Invalid status'),
  body('assignedTo').notEmpty().withMessage('Assigned To is required').isMongoId(),
  body('company').notEmpty().withMessage('Company is required').isMongoId(),
];

const statusRules = [
  param('id').isMongoId(),
  body('status').isIn(LEAD_STATUSES).withMessage('Invalid status'),
];

const idParam = [param('id').isMongoId()];

module.exports = { listRules, upsertRules, statusRules, idParam };
