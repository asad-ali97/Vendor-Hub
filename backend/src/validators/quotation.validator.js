const { body } = require('express-validator');

const quotationValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Quotation title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('vendor')
    .notEmpty().withMessage('Vendor is required')
    .isMongoId().withMessage('Invalid vendor ID'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('status')
    .optional()
    .isIn(['Pending', 'Submitted', 'Approved', 'Rejected'])
    .withMessage('Invalid status value'),
  body('submissionDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
];

const statusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Submitted', 'Approved', 'Rejected'])
    .withMessage('Status must be Pending, Submitted, Approved, or Rejected'),
];

module.exports = { quotationValidator, statusValidator };
