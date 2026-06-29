const express = require('express');
const dashRouter = express.Router();
const actRouter = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { getActivities } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth.middleware');

dashRouter.get('/stats', protect, getDashboardStats);
actRouter.get('/', protect, getActivities);

module.exports = { dashRouter, actRouter };
