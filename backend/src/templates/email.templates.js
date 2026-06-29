/**
 * Email Templates — VendorHub
 * All templates use inline CSS for maximum email client compatibility.
 * Color palette: Emerald (#059669), Charcoal (#1e293b), Off-white (#f8fafc)
 */

const baseLayout = (content, previewText = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>VendorHub</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f1f5f9; }
    a { color:#059669; text-decoration:none; }
    a:hover { text-decoration:underline; }
  </style>
</head>
<body style="background:#f1f5f9; margin:0; padding:20px 0;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <!-- Header -->
    <tr>
      <td style="background:#064e3b;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:36px;height:36px;background:#10b981;border-radius:8px;display:inline-block;line-height:36px;text-align:center;">
                  <span style="color:white;font-size:18px;font-weight:bold;">V</span>
                </div>
                <span style="color:white;font-size:22px;font-weight:700;letter-spacing:-0.5px;vertical-align:middle;">VendorHub</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:#ffffff;padding:36px 32px;">
        ${content}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
        <p style="font-size:12px;color:#94a3b8;line-height:1.6;">
          You received this email because you have an account on VendorHub.<br/>
          © ${new Date().getFullYear()} VendorHub. All rights reserved.
        </p>
        <p style="font-size:12px;color:#cbd5e1;margin-top:6px;">
          If you did not request this email, you can safely ignore it.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

const btn = (text, url) => `
  <table cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td style="background:#059669;border-radius:8px;padding:13px 28px;text-align:center;">
        <a href="${url}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;">${text}</a>
      </td>
    </tr>
  </table>`;

const divider = () => `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />`;

const infoRow = (label, value) => `
  <tr>
    <td style="padding:8px 12px;background:#f0fdf4;border-left:3px solid #059669;border-radius:0 4px 4px 0;margin-bottom:8px;">
      <span style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${label}</span><br/>
      <span style="font-size:14px;font-weight:500;color:#1e293b;">${value}</span>
    </td>
  </tr>`;

// ─── Template 1: Welcome Email ────────────────────────────────────────────────
const welcomeEmail = ({ name, loginUrl }) => {
  const content = `
    <h1 style="font-size:26px;font-weight:700;color:#064e3b;margin-bottom:6px;">
      Welcome to VendorHub! 🎉
    </h1>
    <p style="font-size:15px;color:#475569;margin-bottom:20px;">Hi <strong>${name}</strong>,</p>
    <p style="font-size:15px;color:#475569;line-height:1.7;margin-bottom:16px;">
      Your account has been created successfully. VendorHub is your centralized platform
      for managing vendors, creating quotation requests, and comparing vendor proposals.
    </p>

    ${divider()}

    <h3 style="font-size:14px;font-weight:600;color:#1e293b;margin-bottom:12px;">
      🚀 What you can do with VendorHub:
    </h3>
    <table cellpadding="0" cellspacing="0" width="100%">
      ${[
        ['🏢', 'Manage Vendors', 'Add, search, and track all your vendors in one place'],
        ['📋', 'Quotation Requests', 'Create requests and assign them to vendors instantly'],
        ['⚖️', 'Compare Bids', 'Side-by-side comparison with best-value highlighting'],
        ['📊', 'Analytics Dashboard', 'Real-time charts and activity tracking'],
      ].map(([icon, title, desc]) => `
        <tr>
          <td style="padding:8px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:20px;width:36px;vertical-align:top;">${icon}</td>
                <td style="padding-left:8px;">
                  <p style="font-size:14px;font-weight:600;color:#1e293b;margin:0;">${title}</p>
                  <p style="font-size:13px;color:#64748b;margin:2px 0 0;">${desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`).join('')}
    </table>

    ${btn('Sign In to Your Account', loginUrl)}

    <p style="font-size:13px;color:#94a3b8;text-align:center;">
      Or copy this link: <a href="${loginUrl}" style="color:#059669;">${loginUrl}</a>
    </p>`;

  return baseLayout(content, `Welcome to VendorHub, ${name}! Your account is ready.`);
};

// ─── Template 2: Login Alert ──────────────────────────────────────────────────
const loginAlertEmail = ({ name, time, device, ip, securityUrl }) => {
  const content = `
    <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:600;color:#92400e;margin:0;">
        🔔 New sign-in detected on your account
      </p>
    </div>

    <h2 style="font-size:22px;font-weight:700;color:#1e293b;margin-bottom:8px;">Login Alert</h2>
    <p style="font-size:15px;color:#475569;margin-bottom:20px;">
      Hi <strong>${name}</strong>, we noticed a new sign-in to your VendorHub account.
    </p>

    <table cellpadding="0" cellspacing="6" width="100%" style="border-collapse:separate;border-spacing:0 6px;">
      ${infoRow('Time', time)}
      ${infoRow('Device / Browser', device)}
      ${infoRow('IP Address', ip)}
    </table>

    ${divider()}

    <p style="font-size:15px;color:#1e293b;font-weight:500;margin-bottom:8px;">Was this you?</p>
    <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:4px;">
      ✅ <strong>Yes, this was me</strong> — no action needed. You're all set.
    </p>
    <p style="font-size:14px;color:#475569;line-height:1.6;">
      🚨 <strong>Not you?</strong> — Change your password immediately and contact your administrator.
    </p>

    ${btn('Secure My Account', securityUrl)}`;

  return baseLayout(content, `New login to your VendorHub account at ${time}`);
};

// ─── Template 3: Quotation Assigned ──────────────────────────────────────────
const quotationAssignedEmail = ({ vendorName, quotationTitle, amount, currency, deadline, description, viewUrl }) => {
  const content = `
    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:600;color:#065f46;margin:0;">
        📋 You have a new quotation request
      </p>
    </div>

    <h2 style="font-size:22px;font-weight:700;color:#1e293b;margin-bottom:6px;">New Quotation Request</h2>
    <p style="font-size:15px;color:#475569;margin-bottom:20px;">
      Dear <strong>${vendorName}</strong>, a new quotation request has been assigned to you.
      Please review the details below and respond promptly.
    </p>

    <table cellpadding="0" cellspacing="6" width="100%" style="border-collapse:separate;border-spacing:0 6px;">
      ${infoRow('Quotation Title', quotationTitle)}
      ${infoRow('Budget / Amount', `${currency || 'USD'} ${Number(amount).toLocaleString()}`)}
      ${deadline ? infoRow('Response Deadline', new Date(deadline).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })) : ''}
      ${description ? infoRow('Description', description) : ''}
    </table>

    ${divider()}

    <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px;">
      Please log in to VendorHub to view the complete details, ask questions,
      or submit your proposal.
    </p>

    ${btn('View Quotation Request', viewUrl)}`;

  return baseLayout(content, `New quotation request: ${quotationTitle}`);
};

// ─── Template 4: Quotation Status Change ─────────────────────────────────────
const quotationStatusEmail = ({ vendorName, quotationTitle, status, reviewerName, notes, viewUrl }) => {
  const isApproved = status === 'Approved';
  const statusConfig = {
    Approved: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', icon: '✅', label: 'Congratulations!' },
    Rejected: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '❌', label: 'Update Required' },
    Submitted:{ bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '📤', label: 'Under Review' },
    Pending:  { bg: '#fefce8', border: '#fde68a', text: '#92400e', icon: '⏳', label: 'Status Update' },
  };
  const cfg = statusConfig[status] || statusConfig.Pending;

  const content = `
    <div style="background:${cfg.bg};border:1px solid ${cfg.border};border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:600;color:${cfg.text};margin:0;">
        ${cfg.icon} ${cfg.label} — Quotation status updated to <strong>${status}</strong>
      </p>
    </div>

    <h2 style="font-size:22px;font-weight:700;color:#1e293b;margin-bottom:6px;">Quotation Status Update</h2>
    <p style="font-size:15px;color:#475569;margin-bottom:20px;">
      Dear <strong>${vendorName}</strong>, the status of your quotation has been updated.
    </p>

    <table cellpadding="0" cellspacing="6" width="100%" style="border-collapse:separate;border-spacing:0 6px;">
      ${infoRow('Quotation', quotationTitle)}
      ${infoRow('New Status', status)}
      ${reviewerName ? infoRow('Reviewed By', reviewerName) : ''}
      ${notes ? infoRow('Notes / Feedback', notes) : ''}
    </table>

    ${divider()}

    <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px;">
      ${isApproved
        ? 'Your proposal has been <strong>approved</strong>. Please await further instructions from the procurement team regarding next steps.'
        : 'Your proposal was not selected at this time. Please review any feedback provided and feel free to reach out for clarification.'}
    </p>

    ${btn('View Quotation Details', viewUrl)}`;

  return baseLayout(content, `Your quotation "${quotationTitle}" has been ${status}`);
};

// ─── Template 5: Test Email ───────────────────────────────────────────────────
const testEmail = ({ adminName, timestamp }) => {
  const content = `
    <h2 style="font-size:22px;font-weight:700;color:#1e293b;margin-bottom:8px;">
      ✅ Email Configuration Test
    </h2>
    <p style="font-size:15px;color:#475569;margin-bottom:20px;">
      Hi <strong>${adminName}</strong>, your VendorHub email configuration is working correctly!
    </p>

    <table cellpadding="0" cellspacing="6" width="100%" style="border-collapse:separate;border-spacing:0 6px;">
      ${infoRow('Test Sent At', timestamp)}
      ${infoRow('Status', '✅ Email delivery is working')}
      ${infoRow('Provider', 'Gmail SMTP via Nodemailer')}
    </table>

    ${divider()}

    <p style="font-size:14px;color:#475569;line-height:1.6;">
      All four email notification types are now active:
    </p>
    <ul style="margin:12px 0 0 20px;color:#475569;font-size:14px;line-height:1.8;">
      <li>Welcome email on registration</li>
      <li>Login alert on every sign-in</li>
      <li>Quotation assignment notification</li>
      <li>Quotation status change notification</li>
    </ul>`;

  return baseLayout(content, 'VendorHub email test — configuration is working!');
};

module.exports = {
  welcomeEmail,
  loginAlertEmail,
  quotationAssignedEmail,
  quotationStatusEmail,
  testEmail,
};
