const { Router } = require('express');
const c = require('../../controllers/dashboard.controller');

const router = Router();

router.get('/stats', c.stats);

module.exports = router;
