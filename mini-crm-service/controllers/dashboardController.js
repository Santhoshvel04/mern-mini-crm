const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const DashboardService = require('../services/DashboardService');

module.exports = {
  stats: asyncHandler(async (req, res) => {
    ok(res, await DashboardService.getStats());
  }),
};
