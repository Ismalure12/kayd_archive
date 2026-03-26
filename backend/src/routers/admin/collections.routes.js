const { Router } = require('express');
const c = require('../../controllers/collections.controller');

const router = Router();

router.get('/', c.list);
router.get('/:id', c.getById);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
