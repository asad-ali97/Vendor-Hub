const vendorService = require('../services/vendor.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, { vendor }, 'Vendor added successfully'));
});

const getVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendors(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Vendors fetched successfully'));
});

const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);
  res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor fetched successfully'));
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body, req.user._id);
  res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor updated successfully'));
});

const deleteVendor = asyncHandler(async (req, res) => {
  await vendorService.deleteVendor(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Vendor deleted successfully'));
});

module.exports = { createVendor, getVendors, getVendorById, updateVendor, deleteVendor };
