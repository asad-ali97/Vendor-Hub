const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const {
  welcomeEmail,
  loginAlertEmail,
  quotationAssignedEmail,
  quotationStatusEmail,
  testEmail,
} = require('../templates/email.templates');

let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    logger.warn('Email not configured — set EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env');
    return null;
  }
  _transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: EMAIL_PORT === '465',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  });
  return _transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    logger.warn(`Email skipped (not configured): ${subject} -> ${to}`);
    return { success: false, reason: 'Email not configured' };
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `VendorHub <${process.env.EMAIL_USER}>`,
      to, subject, html,
    });
    logger.info(`Email sent -> ${to} | ${subject} | ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Email FAILED -> ${to} | ${err.message}`);
    return { success: false, reason: err.message };
  }
};

const sendWelcomeEmail = async (user) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  return sendEmail({
    to: user.email,
    subject: `Welcome to VendorHub, ${user.name}!`,
    html: welcomeEmail({ name: user.name, loginUrl: `${appUrl}/login` }),
  });
};

const sendLoginAlertEmail = async (user, req) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const ua = req?.headers?.['user-agent'] || 'Unknown device';
  const ip = req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || req?.socket?.remoteAddress || 'Unknown';
  let device = ua;
  if (ua.includes('Chrome')) device = `Chrome (${ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : 'Linux'})`;
  else if (ua.includes('Firefox')) device = 'Firefox Browser';
  else if (ua.includes('Safari')) device = 'Safari Browser';
  else if (ua.includes('Postman')) device = 'Postman (API Client)';
  return sendEmail({
    to: user.email,
    subject: 'VendorHub: New sign-in to your account',
    html: loginAlertEmail({
      name: user.name,
      time: new Date().toUTCString(),
      device, ip,
      securityUrl: `${appUrl}/profile`,
    }),
  });
};

const sendQuotationAssignedEmail = async (vendor, quotation) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  return sendEmail({
    to: vendor.email,
    subject: `New Quotation Request: ${quotation.title}`,
    html: quotationAssignedEmail({
      vendorName: vendor.vendorName,
      quotationTitle: quotation.title,
      amount: quotation.amount,
      currency: quotation.currency || 'USD',
      deadline: quotation.deadline,
      description: quotation.description,
      viewUrl: `${appUrl}/quotations/${quotation._id}`,
    }),
  });
};

const sendQuotationStatusEmail = async (vendor, quotation, reviewerName) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  return sendEmail({
    to: vendor.email,
    subject: `Quotation ${quotation.status}: ${quotation.title}`,
    html: quotationStatusEmail({
      vendorName: vendor.vendorName,
      quotationTitle: quotation.title,
      status: quotation.status,
      reviewerName,
      notes: quotation.notes,
      viewUrl: `${appUrl}/quotations/${quotation._id}`,
    }),
  });
};

const sendTestEmail = async (admin) => {
  return sendEmail({
    to: admin.email,
    subject: 'VendorHub Email Test — Configuration Working!',
    html: testEmail({
      adminName: admin.name,
      timestamp: new Date().toUTCString(),
    }),
  });
};

const verifyConnection = async () => {
  const transporter = getTransporter();
  if (!transporter) return false;
  try {
    await transporter.verify();
    logger.info('Email SMTP connection verified');
    return true;
  } catch (err) {
    logger.warn(`Email SMTP verification failed: ${err.message}`);
    return false;
  }
};

module.exports = {
  sendEmail, sendWelcomeEmail, sendLoginAlertEmail,
  sendQuotationAssignedEmail, sendQuotationStatusEmail,
  sendTestEmail, verifyConnection,
};
