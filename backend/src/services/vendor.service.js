const Vendor = require('../models/Vendor.model');
const Activity = require('../models/Activity.model');
const ApiError = require('../utils/ApiError');

const createVendor = async (data, userId) => {
  const existing = await Vendor.findOne({ email: data.email });
  if (existing) throw new ApiError(400, 'A vendor with this email already exists');

  const vendor = await Vendor.create({ ...data, createdBy: userId });

  await Activity.create({
    action: 'VENDOR_CREATED',
    description: `Vendor "${vendor.vendorName}" from "${vendor.companyName}" was added`,
    entityType: 'vendor',
    entityId: vendor._id,
    entityName: vendor.vendorName,
    user: userId,
  });

  return vendor;
};

const getVendors = async ({ page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' }) => {
  const query = {};

  if (search) {
    query.$or = [
      { vendorName: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { contactNumber: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [vendors, total] = await Promise.all([
    Vendor.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Vendor.countDocuments(query),
  ]);

  return {
    vendors,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findById(id).populate('createdBy', 'name email');
  if (!vendor) throw new ApiError(404, 'Vendor not found');
  return vendor;
};

const updateVendor = async (id, data, userId) => {
  const vendor = await Vendor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');

  if (!vendor) throw new ApiError(404, 'Vendor not found');

  await Activity.create({
    action: 'VENDOR_UPDATED',
    description: `Vendor "${vendor.vendorName}" was updated`,
    entityType: 'vendor',
    entityId: vendor._id,
    entityName: vendor.vendorName,
    user: userId,
  });

  return vendor;
};

const deleteVendor = async (id, userId) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) throw new ApiError(404, 'Vendor not found');

  const name = vendor.vendorName;
  await vendor.deleteOne();

  await Activity.create({
    action: 'VENDOR_DELETED',
    description: `Vendor "${name}" was deleted`,
    entityType: 'vendor',
    entityId: id,
    entityName: name,
    user: userId,
  });

  return true;
};

const getVendorStats = async () => {
  const [total, active, inactive] = await Promise.all([
    Vendor.countDocuments(),
    Vendor.countDocuments({ status: 'Active' }),
    Vendor.countDocuments({ status: 'Inactive' }),
  ]);
  return { total, active, inactive };
};

module.exports = { createVendor, getVendors, getVendorById, updateVendor, deleteVendor, getVendorStats };
