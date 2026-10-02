const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');
const CompanyService = require('../services/CompanyService');

module.exports = {
  list: asyncHandler(async (req, res) => {
    ok(res, await CompanyService.list());
  }),
  create: asyncHandler(async (req, res) => {
    created(res, await CompanyService.create(req.body));
  }),
  getById: asyncHandler(async (req, res) => {
    ok(res, await CompanyService.getById(req.params.id));
  }),
};
