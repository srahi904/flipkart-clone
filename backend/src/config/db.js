const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../generated/prisma');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = global.__prisma__ || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma__ = prisma;
}

module.exports = prisma;
