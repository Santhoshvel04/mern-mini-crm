const { Router } = require('express');
const c = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createRules, statusRules } = require('../validators/taskValidator');

const router = Router();
router.use(authMiddleware);

router.get('/', c.list);
router.post('/', validate(createRules), c.create);
router.patch('/:id/status', validate(statusRules), c.updateStatus);

module.exports = router;
