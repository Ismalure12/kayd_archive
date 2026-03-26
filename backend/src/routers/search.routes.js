const { Router } = require('express');
const c = require('../controllers/search.controller');

const router = Router();

router.get('/', c.search);

module.exports = router;
