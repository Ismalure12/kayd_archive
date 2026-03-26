const tagsService = require('../services/tags.service');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const tags = await tagsService.listTags();
    success(res, tags);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const tag = await tagsService.createTag(req.body);
    success(res, tag, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const tag = await tagsService.updateTag(req.params.id, req.body);
    success(res, tag);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await tagsService.deleteTag(req.params.id);
    success(res, null);
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
