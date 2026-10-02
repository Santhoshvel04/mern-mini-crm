const { Router } = require('express');
const c = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.use(authMiddleware);
router.get('/stats', c.stats);

module.exports = router;
