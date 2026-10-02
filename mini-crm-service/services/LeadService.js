const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const pagination = require('../utils/pagination');
const serialize = require('../utils/serialize');
const { LEAD_STATUSES } = require('../utils/constants');

const POPULATE = [
  { path: 'assignedTo', select: 'name email' },
  { path: 'company', select: 'name industry location' },
];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertObjectId(id, label) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest(`Invalid ${label}`);
}

async function assertRefs({ assignedTo, company }) {
  if (assignedTo) {
    assertObjectId(assignedTo, 'assignedTo');
    const user = await User.findById(assignedTo);
    if (!user) throw ApiError.badRequest('Assigned user not found');
  }
  if (company) {
    assertObjectId(company, 'company');
    const c = await Company.findById(company);
    if (!c) throw ApiError.badRequest('Company not found');
  }
}

async function list(query) {
  const { page, limit, skip } = pagination(query);
  const filter = { isDeleted: false };

  if (query.status) {
    if (!LEAD_STATUSES.includes(query.status)) throw ApiError.badRequest('Invalid status');
    filter.status = query.status;
  }

  const search = String(query.search || '').trim();
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const [rows, total] = await Promise.all([
    Lead.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  return {
    data: rows.map(serialize.lead),
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
}

async function getById(id) {
  assertObjectId(id, 'lead id');
  const row = await Lead.findOne({ _id: id, isDeleted: false }).populate(POPULATE);
  if (!row) throw ApiError.notFound('Lead not found');
  return serialize.lead(row);
}

async function create(body) {
  await assertRefs({ assignedTo: body.assignedTo, company: body.company });
  const row = await Lead.create({
    name: body.name,
    email: body.email,
    phone: body.phone || '',
    status: body.status || 'New',
    assignedTo: body.assignedTo,
    company: body.company,
  });
  return getById(row._id);
}

async function update(id, body) {
  assertObjectId(id, 'lead id');
  await assertRefs({ assignedTo: body.assignedTo, company: body.company });
  const row = await Lead.findOne({ _id: id, isDeleted: false });
  if (!row) throw ApiError.notFound('Lead not found');

  row.name = body.name;
  row.email = body.email;
  row.phone = body.phone || '';
  row.status = body.status;
  row.assignedTo = body.assignedTo;
  row.company = body.company;
  await row.save();
  return getById(row._id);
}

async function updateStatus(id, status) {
  if (!LEAD_STATUSES.includes(status)) throw ApiError.badRequest('Invalid status');
  assertObjectId(id, 'lead id');
  const row = await Lead.findOne({ _id: id, isDeleted: false });
  if (!row) throw ApiError.notFound('Lead not found');
  row.status = status;
  await row.save();
  return getById(row._id);
}

async function softDelete(id) {
  assertObjectId(id, 'lead id');
  const row = await Lead.findOne({ _id: id, isDeleted: false });
  if (!row) throw ApiError.notFound('Lead not found');
  row.isDeleted = true;
  row.deletedAt = new Date();
  await row.save();
}

module.exports = { list, getById, create, update, updateStatus, softDelete };
