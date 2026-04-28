const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

module.exports = globalForPrisma.prisma;
