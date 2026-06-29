const Activity = require('../models/Activity.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getActivities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, entityType, action } = req.query;
  const query = {};

  if (entityType) query.entityType = entityType;
  if (action) query.action = { $regex: action, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);

  const [activities, total] = await Promise.all([
    Activity.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Activity.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      activities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, 'Activities fetched')
  );
});

module.exports = { getActivities };
