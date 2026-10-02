const { Router } = require('express');
const c = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createRules, idParam } = require('../validators/companyValidator');

const router = Router();
router.use(authMiddleware);

router.get('/', c.list);
router.post('/', validate(createRules), c.create);
router.get('/:id', validate(idParam), c.getById);

module.exports = router;
