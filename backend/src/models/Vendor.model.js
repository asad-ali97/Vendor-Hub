const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorName:      { type: String, required: [true, 'Vendor name is required'], trim: true, maxlength: 100 },
    companyName:     { type: String, required: [true, 'Company name is required'], trim: true, maxlength: 100 },
    email:           { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
    contactNumber:   { type: String, required: [true, 'Contact number is required'], trim: true },
    businessAddress: { type: String, required: [true, 'Business address is required'], trim: true },
    category:        { type: String, trim: true, default: 'General' },
    status:          { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes:           { type: String, trim: true },
    createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// NOTE: email has unique:true which auto-creates an index — not duplicated below
vendorSchema.index({ vendorName: 'text', companyName: 'text', email: 'text' });
vendorSchema.index({ status: 1 });
vendorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Vendor', vendorSchema);
