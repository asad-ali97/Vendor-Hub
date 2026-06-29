const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { vendorValidator, updateVendorValidator } = require('../validators/vendor.validator');

router.use(protect);

router.route('/')
  .get(vendorController.getVendors)
  .post(validate(vendorValidator), vendorController.createVendor);

router.route('/:id')
  .get(vendorController.getVendorById)
  .put(validate(updateVendorValidator), vendorController.updateVendor)
  .delete(vendorController.deleteVendor);

module.exports = router;
