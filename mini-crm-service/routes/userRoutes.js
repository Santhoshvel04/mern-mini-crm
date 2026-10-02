const { Router } = require('express');
const c = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.use(authMiddleware);
router.get('/', c.list);

module.exports = router;
