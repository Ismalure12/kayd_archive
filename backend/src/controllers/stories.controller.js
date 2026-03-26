const storiesService = require('../services/stories.service');
const { success, paginated } = require('../utils/response');
const { getPagination } = require('../utils/pagination');

async function list(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { tag, authorSlug, language } = req.query;
    const { stories, total } = await storiesService.listStories({ page, limit, skip, tag, authorSlug, language });
    paginated(res, stories, total, page, limit);
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const story = await storiesService.getStoryBySlug(req.params.slug);
    success(res, story);
  } catch (err) { next(err); }
}

async function listAdmin(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, authorId, isPublished } = req.query;
    const { stories, total } = await storiesService.listStoriesAdmin({ page, limit, skip, search, authorId, isPublished });
    paginated(res, stories, total, page, limit);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const story = await storiesService.getStoryById(req.params.id);
    success(res, story);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const story = await storiesService.createStory(req.body);
    success(res, story, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const story = await storiesService.updateStory(req.params.id, req.body);
    success(res, story);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await storiesService.deleteStory(req.params.id);
    success(res, null);
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, listAdmin, getById, create, update, remove };
