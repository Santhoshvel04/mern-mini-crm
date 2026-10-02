const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');
const LeadService = require('../services/LeadService');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const { data, meta } = await LeadService.list(req.query);
    ok(res, data, meta);
  }),
  getById: asyncHandler(async (req, res) => {
    ok(res, await LeadService.getById(req.params.id));
  }),
  create: asyncHandler(async (req, res) => {
    created(res, await LeadService.create(req.body));
  }),
  update: asyncHandler(async (req, res) => {
    ok(res, await LeadService.update(req.params.id, req.body));
  }),
  updateStatus: asyncHandler(async (req, res) => {
    ok(res, await LeadService.updateStatus(req.params.id, req.body.status));
  }),
  remove: asyncHandler(async (req, res) => {
    await LeadService.softDelete(req.params.id);
    ok(res, { deleted: true });
  }),
};
