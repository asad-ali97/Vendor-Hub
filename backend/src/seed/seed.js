require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const Quotation = require('../models/Quotation.model');
const Activity = require('../models/Activity.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vendor-management';

const vendors = [
  { vendorName: 'Ahmed Khan', companyName: 'TechSupply Co.', email: 'ahmed@techsupply.com', contactNumber: '+1-555-0101', businessAddress: '123 Tech St, Silicon Valley, CA', category: 'Technology', status: 'Active' },
  { vendorName: 'Sara Johnson', companyName: 'Office Pro Ltd.', email: 'sara@officepro.com', contactNumber: '+1-555-0102', businessAddress: '456 Office Ave, New York, NY', category: 'Office Supplies', status: 'Active' },
  { vendorName: 'Michael Chen', companyName: 'BuildRight Construction', email: 'mchen@buildright.com', contactNumber: '+1-555-0103', businessAddress: '789 Builder Rd, Austin, TX', category: 'Construction', status: 'Active' },
  { vendorName: 'Fatima Al-Hassan', companyName: 'Global Logistics', email: 'fatima@globallogistics.com', contactNumber: '+1-555-0104', businessAddress: '321 Logistics Blvd, Chicago, IL', category: 'Logistics', status: 'Active' },
  { vendorName: 'David Park', companyName: 'Creative Media Studio', email: 'dpark@creativemedia.com', contactNumber: '+1-555-0105', businessAddress: '654 Creative Lane, Los Angeles, CA', category: 'Media', status: 'Active' },
  { vendorName: 'Elena Martinez', companyName: 'CleanServ Solutions', email: 'elena@cleanserv.com', contactNumber: '+1-555-0106', businessAddress: '987 Clean St, Miami, FL', category: 'Cleaning', status: 'Active' },
  { vendorName: 'James Wilson', companyName: 'SafeGuard Security', email: 'jwilson@safeguard.com', contactNumber: '+1-555-0107', businessAddress: '147 Security Ave, Dallas, TX', category: 'Security', status: 'Inactive' },
  { vendorName: 'Priya Sharma', companyName: 'FoodCater Express', email: 'priya@foodcater.com', contactNumber: '+1-555-0108', businessAddress: '258 Catering Rd, San Francisco, CA', category: 'Catering', status: 'Active' },
  { vendorName: 'Robert Brown', companyName: 'PrintMaster Inc.', email: 'rbrown@printmaster.com', contactNumber: '+1-555-0109', businessAddress: '369 Print Blvd, Seattle, WA', category: 'Printing', status: 'Active' },
  { vendorName: 'Amina Osei', companyName: 'GreenEnergy Solutions', email: 'amina@greenenergy.com', contactNumber: '+1-555-0110', businessAddress: '741 Energy Way, Denver, CO', category: 'Energy', status: 'Active' },
];

const GROUP_A = 'grp-office-supplies-2024';
const GROUP_B = 'grp-it-equipment-2024';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv.includes('--destroy')) {
      await Promise.all([
        User.deleteMany({}),
        Vendor.deleteMany({}),
        Quotation.deleteMany({}),
        Activity.deleteMany({}),
      ]);
      console.log('🗑️  All data destroyed');
      await mongoose.disconnect();
      return;
    }

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Quotation.deleteMany({}),
      Activity.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@vendorsystem.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@vendorsystem.com / admin123');

    // Create vendors with createdBy
    const createdVendors = await Vendor.insertMany(
      vendors.map((v) => ({ ...v, createdBy: admin._id }))
    );
    console.log(`🏢 Created ${createdVendors.length} vendors`);

    // Create quotations
    const quotationData = [
      { title: 'Office Stationery Q1', description: 'Stationery and supplies for Q1', vendor: createdVendors[1]._id, amount: 2500, status: 'Approved', quotationGroup: GROUP_A, submissionDate: new Date('2024-01-15') },
      { title: 'Office Stationery Q1 - Alt', description: 'Alternative quote for office supplies', vendor: createdVendors[8]._id, amount: 2200, status: 'Approved', quotationGroup: GROUP_A, submissionDate: new Date('2024-01-16') },
      { title: 'Office Stationery Q1 - Budget', description: 'Budget option for supplies', vendor: createdVendors[5]._id, amount: 1950, status: 'Approved', quotationGroup: GROUP_A, submissionDate: new Date('2024-01-17') },
      { title: 'IT Equipment Purchase', description: 'Laptops and accessories for new hires', vendor: createdVendors[0]._id, amount: 45000, status: 'Submitted', quotationGroup: GROUP_B, submissionDate: new Date('2024-02-10') },
      { title: 'IT Equipment - Secondary Bid', description: 'Alternative IT hardware quote', vendor: createdVendors[4]._id, amount: 42500, status: 'Submitted', quotationGroup: GROUP_B, submissionDate: new Date('2024-02-12') },
      { title: 'Security System Upgrade', description: 'CCTV and access control system', vendor: createdVendors[6]._id, amount: 18000, status: 'Pending', submissionDate: null },
      { title: 'Catering - Annual Conference', description: 'Full catering for 200 attendees', vendor: createdVendors[7]._id, amount: 12000, status: 'Pending', submissionDate: null },
      { title: 'Office Cleaning Contract', description: 'Monthly cleaning services for HQ', vendor: createdVendors[5]._id, amount: 5500, status: 'Submitted', submissionDate: new Date('2024-03-01') },
      { title: 'Marketing Materials Print', description: 'Brochures and banners', vendor: createdVendors[8]._id, amount: 3200, status: 'Rejected', submissionDate: new Date('2024-02-20') },
      { title: 'Logistics - Q2 Shipments', description: 'Freight and delivery for Q2', vendor: createdVendors[3]._id, amount: 9800, status: 'Approved', submissionDate: new Date('2024-03-05') },
      { title: 'Solar Panel Installation', description: 'Rooftop solar energy setup', vendor: createdVendors[9]._id, amount: 85000, status: 'Pending', submissionDate: null },
      { title: 'Construction - Warehouse Ext.', description: 'Warehouse extension project', vendor: createdVendors[2]._id, amount: 150000, status: 'Submitted', submissionDate: new Date('2024-03-10') },
      { title: 'Tech Support Annual Plan', description: 'IT support and maintenance', vendor: createdVendors[0]._id, amount: 24000, status: 'Approved', submissionDate: new Date('2024-01-05') },
      { title: 'Brand Identity Design', description: 'Logo and branding package', vendor: createdVendors[4]._id, amount: 7500, status: 'Submitted', submissionDate: new Date('2024-03-15') },
      { title: 'Emergency Supplies Kit', description: 'First aid and safety supplies', vendor: createdVendors[1]._id, amount: 1200, status: 'Pending', submissionDate: null },
    ];

    await Quotation.insertMany(quotationData.map((q) => ({ ...q, createdBy: admin._id })));
    console.log(`📋 Created ${quotationData.length} quotations`);

    // Create activity logs
    const activities = [
      { action: 'USER_REGISTERED', description: 'Admin user created the system account', entityType: 'user', entityId: admin._id, entityName: 'Admin User', user: admin._id },
      { action: 'VENDOR_CREATED', description: 'Vendor "Ahmed Khan" from "TechSupply Co." was added', entityType: 'vendor', entityId: createdVendors[0]._id, entityName: 'Ahmed Khan', user: admin._id },
      { action: 'VENDOR_CREATED', description: 'Vendor "Sara Johnson" from "Office Pro Ltd." was added', entityType: 'vendor', entityId: createdVendors[1]._id, entityName: 'Sara Johnson', user: admin._id },
      { action: 'QUOTATION_CREATED', description: 'Quotation "IT Equipment Purchase" created', entityType: 'quotation', entityName: 'IT Equipment Purchase', user: admin._id },
      { action: 'QUOTATION_APPROVED', description: 'Quotation "Tech Support Annual Plan" approved', entityType: 'quotation', entityName: 'Tech Support Annual Plan', user: admin._id },
      { action: 'QUOTATION_REJECTED', description: 'Quotation "Marketing Materials Print" was rejected', entityType: 'quotation', entityName: 'Marketing Materials Print', user: admin._id },
      { action: 'VENDOR_UPDATED', description: 'Vendor "James Wilson" status changed to Inactive', entityType: 'vendor', entityId: createdVendors[6]._id, entityName: 'James Wilson', user: admin._id },
      { action: 'QUOTATION_SUBMITTED', description: 'Quotation "Office Cleaning Contract" submitted', entityType: 'quotation', entityName: 'Office Cleaning Contract', user: admin._id },
      { action: 'QUOTATION_APPROVED', description: 'Quotation "Logistics - Q2 Shipments" approved', entityType: 'quotation', entityName: 'Logistics - Q2 Shipments', user: admin._id },
      { action: 'VENDOR_CREATED', description: 'Vendor "Amina Osei" from "GreenEnergy Solutions" was added', entityType: 'vendor', entityId: createdVendors[9]._id, entityName: 'Amina Osei', user: admin._id },
    ];

    await Activity.insertMany(activities);
    console.log(`📝 Created ${activities.length} activity logs`);

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('🔑 Demo Credentials:');
    console.log('   Email:    admin@vendorsystem.com');
    console.log('   Password: admin123');
    console.log('─────────────────────────────────\n');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
