const authorsService = require('../services/authors.service');
const { success, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');

async function list(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { authors, total } = await authorsService.listAuthors({ page, limit, skip, search: req.query.search });
    paginated(res, authors, total, page, limit);
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const author = await authorsService.getAuthorBySlug(req.params.slug);
    success(res, author);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const author = await authorsService.getAuthorById(req.params.id);
    success(res, author);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const author = await authorsService.createAuthor(req.body);
    success(res, author, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const author = await authorsService.updateAuthor(req.params.id, req.body);
    success(res, author);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await authorsService.deleteAuthor(req.params.id);
    success(res, null);
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, getById, create, update, remove };
