const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');
const { generateSlug } = require('../utils/slug');

async function listTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { stories: true } } },
  });
}

async function createTag(data) {
  const slug = data.slug || generateSlug(data.name);
  const exists = await prisma.tag.findFirst({
    where: { OR: [{ name: data.name }, { slug }] },
  });
  if (exists) throw new AppError('Tag already exists', 409);
  return prisma.tag.create({ data: { name: data.name, slug } });
}

async function updateTag(id, data) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) throw new AppError('Tag not found', 404);
  if (data.slug) {
    const exists = await prisma.tag.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (exists) throw new AppError('Slug already in use', 409);
  }
  return prisma.tag.update({ where: { id }, data });
}

async function deleteTag(id) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) throw new AppError('Tag not found', 404);
  return prisma.tag.delete({ where: { id } });
}

module.exports = { listTags, createTag, updateTag, deleteTag };
