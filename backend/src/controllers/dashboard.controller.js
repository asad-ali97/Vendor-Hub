const Vendor = require('../models/Vendor.model');
const Quotation = require('../models/Quotation.model');
const Activity = require('../models/Activity.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalVendors, activeVendors, inactiveVendors,
    totalQuotations, pendingQuotations, submittedQuotations,
    approvedQuotations, rejectedQuotations,
    recentActivities, recentQuotations,
  ] = await Promise.all([
    Vendor.countDocuments(),
    Vendor.countDocuments({ status: 'Active' }),
    Vendor.countDocuments({ status: 'Inactive' }),
    Quotation.countDocuments(),
    Quotation.countDocuments({ status: 'Pending' }),
    Quotation.countDocuments({ status: 'Submitted' }),
    Quotation.countDocuments({ status: 'Approved' }),
    Quotation.countDocuments({ status: 'Rejected' }),
    Activity.find().populate('user', 'name').sort({ createdAt: -1 }).limit(8),
    Quotation.find()
      .populate('vendor', 'vendorName companyName')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  // Monthly quotation chart data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const monthlyData = await Quotation.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthlyData.map((d) => ({
    month: months[d._id.month - 1],
    count: d.count,
    totalAmount: d.totalAmount,
  }));

  // Status distribution for pie chart
  const statusDistribution = [
    { name: 'Pending', value: pendingQuotations, color: '#f59e0b' },
    { name: 'Submitted', value: submittedQuotations, color: '#3b82f6' },
    { name: 'Approved', value: approvedQuotations, color: '#10b981' },
    { name: 'Rejected', value: rejectedQuotations, color: '#ef4444' },
  ];

  res.status(200).json(
    new ApiResponse(200, {
      vendors: { total: totalVendors, active: activeVendors, inactive: inactiveVendors },
      quotations: {
        total: totalQuotations, pending: pendingQuotations,
        submitted: submittedQuotations, approved: approvedQuotations, rejected: rejectedQuotations,
      },
      recentActivities,
      recentQuotations,
      chartData,
      statusDistribution,
    }, 'Dashboard stats fetched')
  );
});

module.exports = { getDashboardStats };
