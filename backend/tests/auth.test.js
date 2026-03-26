const request = require('supertest');
const app = require('../src/app');

describe('POST /api/admin/login', () => {
  it('returns token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@kayd.so', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.admin).not.toHaveProperty('passwordHash');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@kayd.so', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'nobody@kayd.so', password: 'admin123' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/admin/login').send({ email: 'admin@kayd.so' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
