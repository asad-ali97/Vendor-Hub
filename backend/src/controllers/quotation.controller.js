const quotationService = require('../services/quotation.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const PDFDocument = require('pdfkit');

const createQuotation = asyncHandler(async (req, res) => {
  const q = await quotationService.createQuotation(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, { quotation: q }, 'Quotation created successfully'));
});

const getQuotations = asyncHandler(async (req, res) => {
  const result = await quotationService.getQuotations(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Quotations fetched successfully'));
});

const getQuotationById = asyncHandler(async (req, res) => {
  const q = await quotationService.getQuotationById(req.params.id);
  res.status(200).json(new ApiResponse(200, { quotation: q }, 'Quotation fetched successfully'));
});

const updateQuotation = asyncHandler(async (req, res) => {
  const q = await quotationService.updateQuotation(req.params.id, req.body, req.user._id);
  res.status(200).json(new ApiResponse(200, { quotation: q }, 'Quotation updated successfully'));
});

const updateStatus = asyncHandler(async (req, res) => {
  const q = await quotationService.updateStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json(new ApiResponse(200, { quotation: q }, `Quotation marked as ${req.body.status}`));
});

const deleteQuotation = asyncHandler(async (req, res) => {
  await quotationService.deleteQuotation(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Quotation deleted successfully'));
});

const compareQuotations = asyncHandler(async (req, res) => {
  const summary = await quotationService.compareQuotations(req.params.quotationGroupId);
  res.status(200).json(new ApiResponse(200, summary, 'Comparison data fetched'));
});

const exportPDF = asyncHandler(async (req, res) => {
  const q = await quotationService.getQuotationById(req.params.id);

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="quotation-${q._id}.pdf"`);
  doc.pipe(res);

  // Header
  doc.fontSize(24).fillColor('#059669').text('QUOTATION', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#6b7280').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(1);

  // Divider
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e5e7eb');
  doc.moveDown(1);

  // Details
  const addRow = (label, value) => {
    doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold').text(label, { continued: true, width: 150 });
    doc.font('Helvetica').fillColor('#111827').text(value || 'N/A');
  };

  doc.fontSize(14).fillColor('#059669').font('Helvetica-Bold').text('Quotation Details');
  doc.moveDown(0.5);
  addRow('Title:', q.title);
  addRow('Status:', q.status);
  addRow('Amount:', `$${q.amount?.toLocaleString()}`);
  addRow('Submission Date:', q.submissionDate ? new Date(q.submissionDate).toLocaleDateString() : 'N/A');
  if (q.description) addRow('Description:', q.description);
  if (q.notes) addRow('Notes:', q.notes);
  doc.moveDown(1);

  // Vendor section
  doc.fontSize(14).fillColor('#059669').font('Helvetica-Bold').text('Vendor Information');
  doc.moveDown(0.5);
  addRow('Vendor Name:', q.vendor?.vendorName);
  addRow('Company:', q.vendor?.companyName);
  addRow('Email:', q.vendor?.email);
  addRow('Contact:', q.vendor?.contactNumber);
  addRow('Address:', q.vendor?.businessAddress);

  doc.end();
});

module.exports = {
  createQuotation, getQuotations, getQuotationById, updateQuotation,
  updateStatus, deleteQuotation, compareQuotations, exportPDF,
};
