require('dotenv').config({ path: '.env.test', override: true });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Unique suffix per test run to avoid collisions
const RUN_ID = Date.now();

function testSlug(name) {
  return `test-${name}-${RUN_ID}`;
}

async function cleanupTestData() {
  // Delete in dependency order
  await prisma.collectionStory.deleteMany({
    where: { story: { slug: { startsWith: 'test-' } } },
  });
  await prisma.storyTag.deleteMany({
    where: { story: { slug: { startsWith: 'test-' } } },
  });
  await prisma.story.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await prisma.collection.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await prisma.tag.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await prisma.author.deleteMany({ where: { slug: { startsWith: 'test-' } } });
}

module.exports = { prisma, testSlug, cleanupTestData };
