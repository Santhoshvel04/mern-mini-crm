const { Router } = require('express');
const c = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { loginRules } = require('../validators/authValidator');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.post('/login', validate(loginRules), c.login);
router.get('/me', authMiddleware, c.me);

module.exports = router;
