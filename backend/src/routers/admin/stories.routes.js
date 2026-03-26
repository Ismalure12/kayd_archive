const { Router } = require('express');
const c = require('../../controllers/stories.controller');

const router = Router();

router.get('/', c.listAdmin);
router.get('/:id', c.getById);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
