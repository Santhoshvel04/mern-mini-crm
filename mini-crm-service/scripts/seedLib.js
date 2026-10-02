const bcrypt = require('bcrypt');
const User = require('../models/User');
const Company = require('../models/Company');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const logger = require('../utils/logger');
const env = require('../config/env');

async function seedData() {
  const passwordHash = await bcrypt.hash(env.seedPassword, 10);

  const john = await User.findOneAndUpdate(
    { email: 'john@mini-crm.com' },
    { name: 'John', email: 'john@mini-crm.com', passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const priya = await User.findOneAndUpdate(
    { email: 'priya@mini-crm.com' },
    { name: 'Priya', email: 'priya@mini-crm.com', passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  await User.findOneAndUpdate(
    { email: 'sksanthosh4321@gmail.com' },
    { name: 'Santhosh', email: 'sksanthosh4321@gmail.com', passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const abc = await Company.findOneAndUpdate(
    { name: 'ABC Corp' },
    { name: 'ABC Corp', industry: 'IT', location: 'Chennai' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  const zen = await Company.findOneAndUpdate(
    { name: 'Zen Retail' },
    { name: 'Zen Retail', industry: 'Retail', location: 'Coimbatore' },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const ravi = await Lead.findOneAndUpdate(
    { email: 'r@mail.com', isDeleted: false },
    {
      name: 'Ravi',
      email: 'r@mail.com',
      phone: '9876543210',
      status: 'New',
      assignedTo: john._id,
      company: abc._id,
      isDeleted: false,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Lead.findOneAndUpdate(
    { email: 'meena@zen.com', isDeleted: false },
    {
      name: 'Meena',
      email: 'meena@zen.com',
      phone: '9000000001',
      status: 'Qualified',
      assignedTo: priya._id,
      company: zen._id,
      isDeleted: false,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const existingTask = await Task.findOne({ title: 'Call', lead: ravi._id });
  if (!existingTask) {
    const due = new Date();
    due.setHours(12, 0, 0, 0);
    await Task.create({
      title: 'Call',
      lead: ravi._id,
      assignedTo: john._id,
      dueDate: due,
      status: 'Pending',
    });
  }

  logger.info(`Seeded demo data. Login: john@mini-crm.com / ${env.seedPassword}`);
}

async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) {
    logger.info(`[seed] skipped, ${count} user(s) already exist`);
    return;
  }
  await seedData();
}

module.exports = { seedData, seedIfEmpty };
