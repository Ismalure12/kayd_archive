const request = require('supertest');
const app = require('../src/app');
const { prisma, testSlug, cleanupTestData } = require('./setup');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/admin/login')
    .send({ email: 'admin@kayd.so', password: 'admin123' });
  token = res.body.data.token;
});

afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
});

const authHeader = () => ({ Authorization: `Bearer ${token}` });

describe('GET /api/admin/dashboard/stats', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/dashboard/stats');
    expect(res.status).toBe(401);
  });

  it('returns 401 with bad token', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard/stats')
      .set('Authorization', 'Bearer badtoken');
    expect(res.status).toBe(401);
  });

  it('returns stats with correct shape', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard/stats')
      .set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('authors');
    expect(res.body.data).toHaveProperty('stories');
    expect(res.body.data).toHaveProperty('publishedStories');
    expect(res.body.data).toHaveProperty('tags');
    expect(res.body.data).toHaveProperty('collections');
    expect(res.body.data).toHaveProperty('totalViews');
  });
});

describe('Admin tags', () => {
  let tagId;

  it('POST /api/admin/tags creates tag', async () => {
    const res = await request(app)
      .post('/api/admin/tags')
      .set(authHeader())
      .send({ name: 'TestTag', slug: testSlug('tag') });
    expect(res.status).toBe(201);
    tagId = res.body.data.id;
  });

  it('PUT /api/admin/tags/:id updates tag', async () => {
    const res = await request(app)
      .put(`/api/admin/tags/${tagId}`)
      .set(authHeader())
      .send({ name: 'TestTagUpdated' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('TestTagUpdated');
  });

  it('DELETE /api/admin/tags/:id deletes tag', async () => {
    const res = await request(app)
      .delete(`/api/admin/tags/${tagId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
  });
});

describe('Admin collections', () => {
  let collectionId;

  it('POST /api/admin/collections creates collection', async () => {
    const res = await request(app)
      .post('/api/admin/collections')
      .set(authHeader())
      .send({ title: 'Test Collection', slug: testSlug('collection') });
    expect(res.status).toBe(201);
    collectionId = res.body.data.id;
  });

  it('GET /api/admin/collections/:id returns collection', async () => {
    const res = await request(app)
      .get(`/api/admin/collections/${collectionId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
  });

  it('DELETE /api/admin/collections/:id deletes collection', async () => {
    const res = await request(app)
      .delete(`/api/admin/collections/${collectionId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
  });
});
