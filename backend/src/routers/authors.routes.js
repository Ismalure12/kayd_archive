const { Router } = require('express');
const c = require('../controllers/authors.controller');

const router = Router();

router.get('/', c.list);
router.get('/:slug', c.getBySlug);

module.exports = router;
