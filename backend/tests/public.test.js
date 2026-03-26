const request = require('supertest');
const app = require('../src/app');
const { prisma, testSlug, cleanupTestData } = require('./setup');
const { AUTHOR_DATA, STORY_DATA } = require('./fixtures');

let author, story;

beforeAll(async () => {
  author = await prisma.author.create({ data: AUTHOR_DATA(testSlug('author-pub')) });
  story = await prisma.story.create({
    data: STORY_DATA(testSlug('story-pub'), author.id),
  });
});

afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});

describe('GET /api/stories', () => {
  it('returns paginated list with correct shape', async () => {
    const res = await request(app).get('/api/stories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('totalPages');
  });

  it('only returns published stories', async () => {
    const unpublished = await prisma.story.create({
      data: { ...STORY_DATA(testSlug('story-unpub'), author.id), isPublished: false },
    });
    const res = await request(app).get('/api/stories');
    const slugs = res.body.data.map((s) => s.slug);
    expect(slugs).not.toContain(unpublished.slug);
    await prisma.story.delete({ where: { id: unpublished.id } });
  });

  it('does not expose story content in list', async () => {
    const res = await request(app).get('/api/stories');
    res.body.data.forEach((s) => expect(s).not.toHaveProperty('content'));
  });
});

describe('GET /api/stories/:slug', () => {
  it('returns full story including content', async () => {
    const res = await request(app).get(`/api/stories/${story.slug}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(story.slug);
    expect(res.body.data).toHaveProperty('content');
    expect(res.body.data).toHaveProperty('author');
  });

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/stories/slug-that-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/authors', () => {
  it('returns paginated list', async () => {
    const res = await request(app).get('/api/authors');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/authors/:slug', () => {
  it('returns author with their published stories', async () => {
    const res = await request(app).get(`/api/authors/${author.slug}`);
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(author.slug);
    expect(Array.isArray(res.body.data.stories)).toBe(true);
  });

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/authors/nobody-here');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/tags', () => {
  it('returns array of tags', async () => {
    const res = await request(app).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/collections', () => {
  it('returns paginated collections', async () => {
    const res = await request(app).get('/api/collections');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/collections/:slug', () => {
  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/collections/no-collection-here');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/search', () => {
  it('returns authors and stories keys', async () => {
    const res = await request(app).get('/api/search?q=Cabdi');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('authors');
    expect(res.body.data).toHaveProperty('stories');
  });

  it('returns empty results for short query', async () => {
    const res = await request(app).get('/api/search?q=x');
    expect(res.status).toBe(200);
    expect(res.body.data.authors).toHaveLength(0);
    expect(res.body.data.stories).toHaveLength(0);
  });
});
