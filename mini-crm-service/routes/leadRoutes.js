const { Router } = require('express');
const c = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { listRules, upsertRules, statusRules, idParam } = require('../validators/leadValidator');

const router = Router();
router.use(authMiddleware);

router.get('/', validate(listRules), c.list);
router.post('/', validate(upsertRules), c.create);
router.get('/:id', validate(idParam), c.getById);
router.put('/:id', validate([...idParam, ...upsertRules]), c.update);
router.patch('/:id/status', validate(statusRules), c.updateStatus);
router.delete('/:id', validate(idParam), c.remove);

module.exports = router;
