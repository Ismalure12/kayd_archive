const prisma = require('../utils/prisma');

async function search(q) {
  if (!q || q.trim().length < 2) return { authors: [], stories: [] };

  const term = q.trim();

  const [authors, stories] = await Promise.all([
    prisma.author.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { nameSomali: { contains: term, mode: 'insensitive' } },
          { bio: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: { id: true, name: true, nameSomali: true, slug: true, photoUrl: true },
    }),
    prisma.story.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { titleSomali: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true, title: true, titleSomali: true, slug: true,
        description: true, coverImageUrl: true, readingTime: true, language: true,
        author: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    }),
  ]);

  return { authors, stories };
}

module.exports = { search };
