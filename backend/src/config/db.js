// Database configuration using Prisma ORM
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

// Test database connection on startup
const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('Make sure:');
    console.error('  1. MySQL server is running');
    console.error('  2. DATABASE_URL in .env is correct');
    console.error('  3. Run: npm run setup');
    process.exit(1);
  }
};

// Initialize connection test
testConnection();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
