const { body, param } = require('express-validator');
const { TASK_STATUSES } = require('../utils/constants');

const createRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('lead').notEmpty().withMessage('Lead is required').isMongoId(),
  body('assignedTo').notEmpty().withMessage('Assigned To is required').isMongoId(),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().toDate(),
  body('status').optional().isIn(TASK_STATUSES),
];

const statusRules = [
  param('id').isMongoId(),
  body('status').isIn(TASK_STATUSES).withMessage('Invalid status'),
];

module.exports = { createRules, statusRules };
