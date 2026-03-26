const collectionsService = require('../services/collections.service');
const { success, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');

async function list(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { collections, total } = await collectionsService.listCollections({ page, limit, skip });
    paginated(res, collections, total, page, limit);
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const collection = await collectionsService.getCollectionBySlug(req.params.slug);
    success(res, collection);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const collection = await collectionsService.getCollectionById(req.params.id);
    success(res, collection);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const collection = await collectionsService.createCollection(req.body);
    success(res, collection, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const collection = await collectionsService.updateCollection(req.params.id, req.body);
    success(res, collection);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await collectionsService.deleteCollection(req.params.id);
    success(res, null);
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, getById, create, update, remove };
