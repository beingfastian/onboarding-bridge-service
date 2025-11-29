// Server startup file
require('dotenv').config();
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database and start server
const startServer = async () => {
  try {
    // Verify database and tables exist
    await prisma.$queryRaw`SELECT 1 FROM provisioned_users LIMIT 1;`;
    console.log('✓ Database tables verified');
  } catch (error) {
    if (error.message.includes('Table') || error.message.includes('doesn\'t exist')) {
      console.error('\n✗ Database tables not found');
      console.error('\nRun migrations to create tables:');
      console.error('  npm run setup');
      console.error('\nOr manually:');
      console.error('  npx prisma migrate dev --name init\n');
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  🚀 Onboarding Bridge Service`);
    console.log(`  Environment: ${NODE_ENV}`);
    console.log(`  Server running on: http://localhost:${PORT}`);
    console.log(`  Health check: http://localhost:${PORT}/api/health`);
    console.log(`  Onboard endpoint: POST http://localhost:${PORT}/api/onboard`);
    console.log(`  Database status: Connected`);
    console.log(`${'='.repeat(60)}\n`);
  });
};

startServer().catch(async (error) => {
  console.error('Failed to start server:', error);
  await prisma.$disconnect();
  process.exit(1);
});
