const request = require('supertest');
const app = require('../src/app');
const { prisma, testSlug, cleanupTestData } = require('./setup');

let token;
let createdId;

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

describe('Admin authors — auth guard', () => {
  it('GET /api/admin/authors returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/authors');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/authors returns 401 with bad token', async () => {
    const res = await request(app)
      .get('/api/admin/authors')
      .set('Authorization', 'Bearer badtoken');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/admin/authors', () => {
  it('creates author and returns 201', async () => {
    const slug = testSlug('author-admin');
    const res = await request(app)
      .post('/api/admin/authors')
      .set(authHeader())
      .send({ name: 'Xasan Ganey', slug });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(slug);
    createdId = res.body.data.id;
  });

  it('returns 409 for duplicate slug', async () => {
    const slug = testSlug('author-admin');
    const res = await request(app)
      .post('/api/admin/authors')
      .set(authHeader())
      .send({ name: 'Duplicate', slug });
    expect(res.status).toBe(409);
  });
});

describe('GET /api/admin/authors/:id', () => {
  it('returns author by id', async () => {
    const res = await request(app)
      .get(`/api/admin/authors/${createdId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/api/admin/authors/00000000-0000-0000-0000-000000000000')
      .set(authHeader());
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/admin/authors/:id', () => {
  it('updates author name', async () => {
    const res = await request(app)
      .put(`/api/admin/authors/${createdId}`)
      .set(authHeader())
      .send({ name: 'Xasan Ganey Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Xasan Ganey Updated');
  });
});

describe('DELETE /api/admin/authors/:id', () => {
  it('deletes author', async () => {
    const res = await request(app)
      .delete(`/api/admin/authors/${createdId}`)
      .set(authHeader());
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
