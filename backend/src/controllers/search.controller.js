const searchService = require('../services/search.service');
const { success } = require('../utils/response');

async function search(req, res, next) {
  try {
    const results = await searchService.search(req.query.q);
    success(res, results);
  } catch (err) { next(err); }
}

module.exports = { search };
