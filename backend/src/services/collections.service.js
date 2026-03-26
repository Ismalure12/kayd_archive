const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');
const { generateSlug } = require('../utils/slug');

async function listCollections({ page, limit, skip }) {
  const [collections, total] = await Promise.all([
    prisma.collection.findMany({
      skip,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: { _count: { select: { stories: true } } },
    }),
    prisma.collection.count(),
  ]);
  return { collections, total };
}

async function getCollectionBySlug(slug) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      stories: {
        orderBy: { sortOrder: 'asc' },
        include: {
          story: {
            select: {
              id: true, title: true, titleSomali: true, slug: true,
              description: true, coverImageUrl: true, readingTime: true,
              language: true, viewCount: true, isPublished: true,
              author: { select: { id: true, name: true, slug: true } },
              tags: { include: { tag: true } },
            },
          },
        },
      },
    },
  });
  if (!collection) throw new AppError('Collection not found', 404);
  return collection;
}

async function getCollectionById(id) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: { stories: { orderBy: { sortOrder: 'asc' }, include: { story: true } } },
  });
  if (!collection) throw new AppError('Collection not found', 404);
  return collection;
}

async function createCollection(data) {
  const slug = data.slug || generateSlug(data.title);
  const exists = await prisma.collection.findUnique({ where: { slug } });
  if (exists) throw new AppError('Slug already in use', 409);

  const { storyIds, ...collectionData } = data;
  return prisma.collection.create({
    data: {
      ...collectionData,
      slug,
      stories: storyIds?.length
        ? { create: storyIds.map((storyId, i) => ({ story: { connect: { id: storyId } }, sortOrder: i })) }
        : undefined,
    },
    include: { stories: { include: { story: true } } },
  });
}

async function updateCollection(id, data) {
  await getCollectionById(id);
  if (data.slug) {
    const exists = await prisma.collection.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (exists) throw new AppError('Slug already in use', 409);
  }

  const { storyIds, ...collectionData } = data;
  return prisma.collection.update({
    where: { id },
    data: {
      ...collectionData,
      stories: storyIds != null
        ? { deleteMany: {}, create: storyIds.map((storyId, i) => ({ story: { connect: { id: storyId } }, sortOrder: i })) }
        : undefined,
    },
    include: { stories: { include: { story: true } } },
  });
}

async function deleteCollection(id) {
  await getCollectionById(id);
  return prisma.collection.delete({ where: { id } });
}

module.exports = { listCollections, getCollectionBySlug, getCollectionById, createCollection, updateCollection, deleteCollection };
