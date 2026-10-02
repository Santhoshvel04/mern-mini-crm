const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

async function login({ email, password }) {
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw ApiError.unauthorized('Invalid email or password');

  return {
    token: signToken(user),
    user: user.toPublic(),
  };
}

module.exports = { login };
