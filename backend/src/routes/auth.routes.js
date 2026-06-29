const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post('/register', authLimiter, validate(registerValidator), authController.register);
router.post('/login',    authLimiter, validate(loginValidator),    authController.login);
router.get('/me',               protect, authController.getMe);
router.put('/profile',          protect, authController.updateProfile);
router.put('/change-password',  protect, authController.changePassword);

module.exports = router;
