// Activity routes are exported from dashboard.routes.js
// This file exists for organizational clarity

const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getActivities);

module.exports = router;
