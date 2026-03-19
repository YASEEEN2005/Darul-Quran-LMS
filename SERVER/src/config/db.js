const { PrismaClient } = require('@prisma/client');

// Use a singleton pattern to avoid multiple instances in dev
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('MongoDB (Prisma via Atlas) connected sequentially.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
