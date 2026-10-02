const mongoose = require('mongoose');
const Company = require('../models/Company');
const Lead = require('../models/Lead');
const ApiError = require('../utils/ApiError');
const serialize = require('../utils/serialize');

async function list() {
  const rows = await Company.find().sort({ name: 1 });
  return rows.map(serialize.company);
}

async function create(body) {
  const row = await Company.create({
    name: body.name,
    industry: body.industry,
    location: body.location,
  });
  return serialize.company(row);
}

async function getById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid company id');
  const row = await Company.findById(id);
  if (!row) throw ApiError.notFound('Company not found');

  const leads = await Lead.find({ company: id, isDeleted: false })
    .populate([{ path: 'assignedTo', select: 'name email' }, { path: 'company', select: 'name industry location' }])
    .sort({ createdAt: -1 });

  return {
    ...serialize.company(row),
    leads: leads.map(serialize.lead),
  };
}

module.exports = { list, create, getById };
