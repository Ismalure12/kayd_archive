const prisma = require('../prisma');

async function getStats() {
  const [authorCount, storyCount, publishedCount, tagCount, collectionCount, viewsAgg, murtiCount] = await Promise.all([
    prisma.author.count(),
    prisma.story.count(),
    prisma.story.count({ where: { isPublished: true } }),
    prisma.tag.count(),
    prisma.collection.count(),
    prisma.story.aggregate({ _sum: { viewCount: true } }),
    prisma.murti.count(),
  ]);

  return {
    authors: authorCount,
    stories: storyCount,
    publishedStories: publishedCount,
    tags: tagCount,
    collections: collectionCount,
    totalViews: viewsAgg._sum.viewCount || 0,
    murti: murtiCount,
  };
}

module.exports = { getStats };
