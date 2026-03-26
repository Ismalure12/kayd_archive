const authService = require('../services/auth.service');
const { success } = require('../utils/response');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const result = await authService.login(email, password);
    success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
