const request = require('supertest');
const app = require('../src/app');
const { prisma, testSlug, cleanupTestData } = require('./setup');
const { STORY_HTML, XSS_HTML, AUTHOR_DATA } = require('./fixtures');

let token, author, createdStoryId;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/admin/login')
    .send({ email: 'admin@kayd.so', password: 'admin123' });
  token = loginRes.body.data.token;

  author = await prisma.author.create({ data: AUTHOR_DATA(testSlug('author-stories')) });
});

afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});

const authHeader = () => ({ Authorization: `Bearer ${token}` });

describe('Admin stories — auth guard', () => {
  it('POST /api/admin/stories returns 401 without token', async () => {
    const res = await request(app).post('/api/admin/stories').send({});
    expect(res.status).toBe(401);
  });

  it('POST /api/admin/stories returns 401 with bad token', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set('Authorization', 'Bearer faketoken')
      .send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/admin/stories', () => {
  it('creates story and returns 201', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set(authHeader())
      .send({
        authorId: author.id,
        title: 'Sheeko Cusub',
        slug: testSlug('story-new'),
        content: STORY_HTML,
        language: 'SOMALI',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    createdStoryId = res.body.data.id;
  });

  it('strips XSS from content on save', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set(authHeader())
      .send({
        authorId: author.id,
        title: 'XSS Story',
        slug: testSlug('story-xss'),
        content: XSS_HTML,
        language: 'SOMALI',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.content).not.toContain('<script>');
    expect(res.body.data.content).not.toContain('onerror');
    expect(res.body.data.content).not.toContain('javascript:');
    expect(res.body.data.content).toContain('Good content');
  });

  it('auto-calculates readingTime from content', async () => {
    const res = await request(app)
      .post('/api/admin/stories')
      .set(authHeader())
      .send({
        authorId: author.id,
        title: 'Reading Time Test',
        slug: testSlug('story-rt'),
        content: STORY_HTML,
        language: 'SOMALI',
      });
    expect(res.status).toBe(201);
    expect(typeof res.body.data.readingTime).toBe('number');
    expect(res.body.data.readingTime).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/admin/stories/:id', () => {
  it('returns story by id', async () => {
    const res = await request(app)
      .get(`/api/admin/stories/${createdStoryId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdStoryId);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/api/admin/stories/00000000-0000-0000-0000-000000000000')
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/admin/stories/:id', () => {
  it('updates story title', async () => {
    const res = await request(app)
      .put(`/api/admin/stories/${createdStoryId}`)
      .set(authHeader())
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('re-sanitizes content on update', async () => {
    const res = await request(app)
      .put(`/api/admin/stories/${createdStoryId}`)
      .set(authHeader())
      .send({ content: XSS_HTML });
    expect(res.status).toBe(200);
    expect(res.body.data.content).not.toContain('<script>');
  });
});

describe('DELETE /api/admin/stories/:id', () => {
  it('deletes story', async () => {
    const res = await request(app)
      .delete(`/api/admin/stories/${createdStoryId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
  });
});
