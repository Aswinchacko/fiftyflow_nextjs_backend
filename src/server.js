import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT} (${config.NODE_ENV})`);
});

process.on('SIGTERM', async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});
