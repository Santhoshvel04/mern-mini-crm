const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const User = require('../models/User');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const users = await User.find().select('name email').sort({ name: 1 });
    ok(res, users.map((u) => ({ id: u._id.toString(), name: u.name, email: u.email })));
  }),
};
