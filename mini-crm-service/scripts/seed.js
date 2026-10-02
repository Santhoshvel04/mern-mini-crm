require('dotenv').config();
const { connectDb, disconnectDb } = require('../config/db');
const logger = require('../utils/logger');
const { seedData } = require('./seedLib');

async function seed() {
  await connectDb();
  await seedData();
  await disconnectDb();
}

seed().catch((e) => {
  logger.error(e.message);
  process.exit(1);
});
