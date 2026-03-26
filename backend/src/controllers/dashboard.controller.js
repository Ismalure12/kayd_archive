const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/response');

async function stats(req, res, next) {
  try {
    const data = await dashboardService.getStats();
    success(res, data);
  } catch (err) { next(err); }
}

module.exports = { stats };
