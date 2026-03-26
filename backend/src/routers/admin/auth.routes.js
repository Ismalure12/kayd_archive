const { Router } = require('express');
const c = require('../../controllers/auth.controller');

const router = Router();

router.post('/login', c.login);

module.exports = router;
