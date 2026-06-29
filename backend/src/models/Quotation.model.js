const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quotation title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    submissionDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    // Group ID for comparing multiple quotations on same request
    quotationGroup: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes
quotationSchema.index({ status: 1 });
quotationSchema.index({ vendor: 1 });
quotationSchema.index({ submissionDate: -1 });
quotationSchema.index({ amount: 1 });
quotationSchema.index({ quotationGroup: 1 });
quotationSchema.index({ createdAt: -1 });
quotationSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Quotation', quotationSchema);
