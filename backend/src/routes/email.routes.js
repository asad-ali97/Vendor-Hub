const express = require('express');
const router = express.Router();
const { testEmailEndpoint, checkConnection } = require('../controllers/email.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Both routes are admin-only
router.use(protect, restrictTo('admin'));

router.get('/test', testEmailEndpoint);      // Send a real test email to the admin's inbox
router.get('/check', checkConnection);       // Verify SMTP connection without sending

module.exports = router;
