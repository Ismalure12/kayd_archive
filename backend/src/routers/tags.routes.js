const { Router } = require('express');
const c = require('../controllers/tags.controller');

const router = Router();

router.get('/', c.list);

module.exports = router;
