const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const AuthService = require('../services/AuthService');

module.exports = {
  login: asyncHandler(async (req, res) => {
    const data = await AuthService.login(req.body);
    ok(res, data);
  }),
  me: asyncHandler(async (req, res) => {
    ok(res, req.auth);
  }),
};
