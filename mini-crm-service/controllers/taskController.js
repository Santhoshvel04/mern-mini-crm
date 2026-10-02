const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/response');
const TaskService = require('../services/TaskService');

module.exports = {
  list: asyncHandler(async (req, res) => {
    ok(res, await TaskService.list());
  }),
  create: asyncHandler(async (req, res) => {
    created(res, await TaskService.create(req.body));
  }),
  updateStatus: asyncHandler(async (req, res) => {
    ok(res, await TaskService.updateStatus(req.params.id, req.body.status, req.auth.id));
  }),
};
