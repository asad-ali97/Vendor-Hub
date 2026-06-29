const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body, req);
  res.status(201).json(new ApiResponse(201, { user, token }, 'Account created successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body, req);
  res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }, 'User profile fetched'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully'));
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});

module.exports = { register, login, getMe, updateProfile, changePassword };
