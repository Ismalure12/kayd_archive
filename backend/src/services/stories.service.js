const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');
const { generateSlug } = require('../utils/slug');
const { sanitizeContent } = require('../utils/sanitize');

const PUBLIC_STORY_SELECT = {
  id: true, title: true, titleSomali: true, slug: true,
  description: true, content: true, coverImageUrl: true, readingTime: true,
  language: true, publishedDate: true, viewCount: true, createdAt: true,
  author: { select: { id: true, name: true, nameSomali: true, slug: true, photoUrl: true } },
  tags: { include: { tag: true } },
};

function extractExcerpt(html, maxLength = 160) {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  return trimmed.slice(0, trimmed.lastIndexOf(' ') || maxLength) + '…';
}

function withExcerpt(story) {
  const { content, ...rest } = story;
  return { ...rest, excerpt: extractExcerpt(content) };
}

async function listStories({ page, limit, skip, tag, authorSlug, language }) {
  const where = { isPublished: true };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (authorSlug) where.author = { slug: authorSlug };
  if (language) where.language = language;

  const [stories, total] = await Promise.all([
    prisma.story.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: PUBLIC_STORY_SELECT }),
    prisma.story.count({ where }),
  ]);

  return { stories: stories.map(withExcerpt), total };
}

async function getStoryBySlug(slug) {
  const story = await prisma.story.findFirst({
    where: { slug, isPublished: true },
    include: {
      author: { select: { id: true, name: true, nameSomali: true, slug: true, photoUrl: true } },
      tags: { include: { tag: true } },
    },
  });
  if (!story) throw new AppError('Story not found', 404);

  await prisma.story.update({ where: { id: story.id }, data: { viewCount: { increment: 1 } } });

  return story;
}

async function listStoriesAdmin({ page, limit, skip, search, authorId, isPublished }) {
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { titleSomali: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (authorId) where.authorId = authorId;
  if (isPublished !== undefined) where.isPublished = isPublished === 'true';

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where, skip, take: limit, orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.story.count({ where }),
  ]);

  return { stories, total };
}

async function getStoryById(id) {
  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });
  if (!story) throw new AppError('Story not found', 404);
  return story;
}

async function createStory(data) {
  const slug = data.slug || generateSlug(data.title);
  const exists = await prisma.story.findUnique({ where: { slug } });
  if (exists) throw new AppError('Slug already in use', 409);

  const { tagIds, ...storyData } = data;
  if (storyData.content) {
    storyData.content = sanitizeContent(storyData.content);
    if (!storyData.readingTime) storyData.readingTime = estimateReadingTime(storyData.content);
  }

  return prisma.story.create({
    data: {
      ...storyData,
      slug,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
        : undefined,
    },
    include: { author: true, tags: { include: { tag: true } } },
  });
}

async function updateStory(id, data) {
  await getStoryById(id);
  const { tagIds, ...storyData } = data;

  if (storyData.slug) {
    const exists = await prisma.story.findFirst({ where: { slug: storyData.slug, NOT: { id } } });
    if (exists) throw new AppError('Slug already in use', 409);
  }
  if (storyData.content) {
    storyData.content = sanitizeContent(storyData.content);
    storyData.readingTime = estimateReadingTime(storyData.content);
  }

  return prisma.story.update({
    where: { id },
    data: {
      ...storyData,
      tags: tagIds != null
        ? { deleteMany: {}, create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
        : undefined,
    },
    include: { author: true, tags: { include: { tag: true } } },
  });
}

async function deleteStory(id) {
  await getStoryById(id);
  return prisma.story.delete({ where: { id } });
}

function estimateReadingTime(html) {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

module.exports = {
  listStories, getStoryBySlug, listStoriesAdmin,
  getStoryById, createStory, updateStory, deleteStory,
};
