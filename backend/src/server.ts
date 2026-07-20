import app from './app';
import { prisma } from './config/database';
import { redis } from './config/redis';
import { validateEnv } from './config/env';

validateEnv();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Connect to Redis (lazy connection; ping to verify)
    try {
      await redis.ping();
      console.log('✅ Connected to Redis');
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed:', (redisError as Error).message);
      console.warn('   Token refresh & logout revocation may not work until Redis is available.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
