const express = require('express');
const router = express.Router();
const qCtrl = require('../controllers/quotation.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { quotationValidator, statusValidator } = require('../validators/quotation.validator');

router.use(protect);

router.get('/compare/:quotationGroupId', qCtrl.compareQuotations);

router.route('/')
  .get(qCtrl.getQuotations)
  .post(validate(quotationValidator), qCtrl.createQuotation);

router.route('/:id')
  .get(qCtrl.getQuotationById)
  .put(qCtrl.updateQuotation)
  .delete(qCtrl.deleteQuotation);

router.patch('/:id/status', validate(statusValidator), qCtrl.updateStatus);
router.get('/:id/export-pdf', qCtrl.exportPDF);

module.exports = router;
