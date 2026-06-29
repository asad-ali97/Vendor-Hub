const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Activity = require('../models/Activity.model');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = async ({ name, email, password, role }, req) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'An account with this email already exists');

  const user = await User.create({ name, email, password, role: role || 'user' });

  await Activity.create({
    action: 'USER_REGISTERED',
    description: `New user "${name}" registered`,
    entityType: 'user',
    entityId: user._id,
    entityName: name,
    user: user._id,
  });

  // Non-blocking welcome email
  emailService.sendWelcomeEmail(user).catch(() => {});

  const token = generateToken(user._id);
  return { user, token };
};

const login = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  // Non-blocking login alert email
  emailService.sendLoginAlertEmail(user, req).catch(() => {});

  const token = generateToken(user._id);
  return { user: user.toJSON(), token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowed = ['name'];
  const filtered = {};
  allowed.forEach((f) => { if (updates[f] !== undefined) filtered[f] = updates[f]; });

  const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = { register, login, getMe, updateProfile, changePassword };
