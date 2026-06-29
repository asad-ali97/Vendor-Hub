const { body } = require('express-validator');

const vendorValidator = [
  body('vendorName')
    .trim()
    .notEmpty().withMessage('Vendor name is required')
    .isLength({ max: 100 }).withMessage('Vendor name cannot exceed 100 characters'),
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('contactNumber')
    .trim()
    .notEmpty().withMessage('Contact number is required'),
  body('businessAddress')
    .trim()
    .notEmpty().withMessage('Business address is required'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

const updateVendorValidator = [
  body('vendorName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Vendor name cannot exceed 100 characters'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

module.exports = { vendorValidator, updateVendorValidator };
