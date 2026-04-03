import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const PORT = process.env.PORT || env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      try {
        await prisma.$disconnect();
        server.close(() => {
          console.log('Server closed successfully');
          process.exit(0);
        });
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();