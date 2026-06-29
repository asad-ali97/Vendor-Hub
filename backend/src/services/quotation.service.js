const Quotation = require('../models/Quotation.model');
const Vendor = require('../models/Vendor.model');
const Activity = require('../models/Activity.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');

const createQuotation = async (data, userId) => {
  const vendor = await Vendor.findById(data.vendor);
  if (!vendor) throw new ApiError(404, 'Vendor not found');

  const quotation = await Quotation.create({ ...data, createdBy: userId });
  await quotation.populate('vendor', 'vendorName companyName email');

  await Activity.create({
    action: 'QUOTATION_CREATED',
    description: `Quotation "${quotation.title}" created and assigned to "${vendor.vendorName}"`,
    entityType: 'quotation',
    entityId: quotation._id,
    entityName: quotation.title,
    user: userId,
  });

  // Non-blocking email to vendor
  emailService.sendQuotationAssignedEmail(vendor, quotation).catch(() => {});

  return quotation;
};

const getQuotations = async ({
  page = 1, limit = 10, search, status, vendor,
  minAmount, maxAmount, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc',
}) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) query.status = status;
  if (vendor) query.vendor = vendor;
  if (minAmount !== undefined || maxAmount !== undefined) {
    query.amount = {};
    if (minAmount !== undefined) query.amount.$gte = Number(minAmount);
    if (maxAmount !== undefined) query.amount.$lte = Number(maxAmount);
  }
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [quotations, total] = await Promise.all([
    Quotation.find(query)
      .populate('vendor', 'vendorName companyName email status')
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Quotation.countDocuments(query),
  ]);

  return {
    quotations,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getQuotationById = async (id) => {
  const q = await Quotation.findById(id)
    .populate('vendor', 'vendorName companyName email contactNumber businessAddress status')
    .populate('createdBy', 'name email')
    .populate('approvedBy', 'name email');
  if (!q) throw new ApiError(404, 'Quotation not found');
  return q;
};

const updateQuotation = async (id, data, userId) => {
  const q = await Quotation.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('vendor', 'vendorName companyName email')
    .populate('createdBy', 'name email');
  if (!q) throw new ApiError(404, 'Quotation not found');

  await Activity.create({
    action: 'QUOTATION_UPDATED',
    description: `Quotation "${q.title}" was updated`,
    entityType: 'quotation',
    entityId: q._id,
    entityName: q.title,
    user: userId,
  });

  return q;
};

const updateStatus = async (id, status, userId) => {
  const extra = {};
  if (status === 'Approved' || status === 'Rejected') {
    extra.approvedBy = userId;
    extra.approvedAt = new Date();
  }

  const q = await Quotation.findByIdAndUpdate(id, { status, ...extra }, { new: true })
    .populate('vendor', 'vendorName companyName email');
  if (!q) throw new ApiError(404, 'Quotation not found');

  const actionMap = {
    Approved:  'QUOTATION_APPROVED',
    Rejected:  'QUOTATION_REJECTED',
    Submitted: 'QUOTATION_SUBMITTED',
    Pending:   'QUOTATION_RESET',
  };

  await Activity.create({
    action: actionMap[status] || 'QUOTATION_STATUS_UPDATED',
    description: `Quotation "${q.title}" status changed to ${status}`,
    entityType: 'quotation',
    entityId: q._id,
    entityName: q.title,
    user: userId,
  });

  // Non-blocking status email
  if (q.vendor?.email && (status === 'Approved' || status === 'Rejected')) {
    const reviewer = await User.findById(userId).select('name');
    emailService.sendQuotationStatusEmail(q.vendor, q, reviewer?.name).catch(() => {});
  }

  return q;
};

const deleteQuotation = async (id, userId) => {
  const q = await Quotation.findById(id);
  if (!q) throw new ApiError(404, 'Quotation not found');

  const title = q.title;
  await q.deleteOne();

  await Activity.create({
    action: 'QUOTATION_DELETED',
    description: `Quotation "${title}" was deleted`,
    entityType: 'quotation',
    entityId: id,
    entityName: title,
    user: userId,
  });

  return true;
};

const compareQuotations = async (quotationGroupId) => {
  const quotations = await Quotation.find({ quotationGroup: quotationGroupId })
    .populate('vendor', 'vendorName companyName email contactNumber')
    .sort({ amount: 1 });

  if (!quotations.length) throw new ApiError(404, 'No quotations found for this group');

  const cheapest = quotations[0];
  return {
    group: quotationGroupId,
    total: quotations.length,
    lowestAmount: cheapest.amount,
    highestAmount: quotations[quotations.length - 1].amount,
    averageAmount: quotations.reduce((s, q) => s + q.amount, 0) / quotations.length,
    cheapestVendor: cheapest.vendor,
    quotations,
  };
};

const getQuotationStats = async () => {
  const [total, pending, submitted, approved, rejected] = await Promise.all([
    Quotation.countDocuments(),
    Quotation.countDocuments({ status: 'Pending' }),
    Quotation.countDocuments({ status: 'Submitted' }),
    Quotation.countDocuments({ status: 'Approved' }),
    Quotation.countDocuments({ status: 'Rejected' }),
  ]);
  return { total, pending, submitted, approved, rejected };
};

module.exports = {
  createQuotation, getQuotations, getQuotationById, updateQuotation,
  updateStatus, deleteQuotation, compareQuotations, getQuotationStats,
};
