const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

async function login(email, password) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  };
}

module.exports = { login };
