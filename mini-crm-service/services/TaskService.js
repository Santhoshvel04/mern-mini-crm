const mongoose = require('mongoose');
const Task = require('../models/Task');
const Lead = require('../models/Lead');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const serialize = require('../utils/serialize');
const { TASK_STATUSES } = require('../utils/constants');

const POPULATE = [
  { path: 'assignedTo', select: 'name email' },
  { path: 'lead', select: 'name email status isDeleted', populate: { path: 'assignedTo', select: 'name email' } },
];

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest(`Invalid ${label}`);
}

async function list() {
  const rows = await Task.find().populate(POPULATE).sort({ dueDate: 1 });
  return rows.map(serialize.task);
}

async function create(body) {
  assertObjectId(body.lead, 'lead');
  assertObjectId(body.assignedTo, 'assignedTo');

  const [lead, user] = await Promise.all([
    Lead.findOne({ _id: body.lead, isDeleted: false }),
    User.findById(body.assignedTo),
  ]);
  if (!lead) throw ApiError.badRequest('Lead not found');
  if (!user) throw ApiError.badRequest('Assigned user not found');

  const row = await Task.create({
    title: body.title,
    lead: body.lead,
    assignedTo: body.assignedTo,
    dueDate: body.dueDate,
    status: body.status || 'Pending',
  });
  const populated = await Task.findById(row._id).populate(POPULATE);
  return serialize.task(populated);
}

async function updateStatus(id, status, authUserId) {
  if (!TASK_STATUSES.includes(status)) throw ApiError.badRequest('Invalid status');
  assertObjectId(id, 'task id');

  const row = await Task.findById(id);
  if (!row) throw ApiError.notFound('Task not found');

  if (row.assignedTo.toString() !== String(authUserId)) {
    throw ApiError.forbidden('Only the assigned user can update task status');
  }

  row.status = status;
  await row.save();
  const populated = await Task.findById(row._id).populate(POPULATE);
  return serialize.task(populated);
}

module.exports = { list, create, updateStatus };
