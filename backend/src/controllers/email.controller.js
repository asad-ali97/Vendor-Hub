const { sendTestEmail, verifyConnection } = require('../services/email.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const testEmailEndpoint = asyncHandler(async (req, res) => {
  const result = await sendTestEmail(req.user);
  if (!result.success) {
    throw new ApiError(500, `Email failed: ${result.reason}. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env`);
  }
  res.status(200).json(
    new ApiResponse(200, { messageId: result.messageId, sentTo: req.user.email },
      `Test email sent to ${req.user.email}. Check your inbox!`)
  );
});

const checkConnection = asyncHandler(async (req, res) => {
  const ok = await verifyConnection();
  if (!ok) {
    throw new ApiError(503, 'Email SMTP connection failed. Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS.');
  }
  res.status(200).json(new ApiResponse(200, { connected: true }, 'SMTP connection is healthy'));
});

module.exports = { testEmailEndpoint, checkConnection };
