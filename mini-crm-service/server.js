const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { connectDb, disconnectDb } = require('./config/db');
const { seedIfEmpty } = require('./scripts/seedLib');

(async () => {
  try {
    await connectDb();
    await seedIfEmpty();
  } catch (e) {
    logger.error(`[db] connection failed: ${e.message}`);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    logger.info(`mini-crm-service listening on :${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (sig) => {
    logger.info(`[shutdown] ${sig} received`);
    server.close(() => {
      disconnectDb().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  ['SIGTERM', 'SIGINT'].forEach((s) => process.on(s, () => shutdown(s)));
})();
