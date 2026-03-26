const { Router } = require('express');
const c = require('../../controllers/tags.controller');

const router = Router();

router.get('/', c.list);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
