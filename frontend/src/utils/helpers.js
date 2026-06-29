import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, fmt);
  } catch { return '—'; }
};

export const formatDatetime = (date) => formatDate(date, 'MMM d, yyyy h:mm a');

export const timeAgo = (date) => {
  if (!date) return '—';
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });
  } catch { return '—'; }
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

export const statusColor = (status) => {
  const map = {
    Pending:   'badge-amber',
    Submitted: 'badge-blue',
    Approved:  'badge-green',
    Rejected:  'badge-red',
    Active:    'badge-green',
    Inactive:  'badge-gray',
  };
  return map[status] || 'badge-gray';
};

export const statusDot = (status) => {
  const map = {
    Pending:   'bg-amber-400',
    Submitted: 'bg-blue-400',
    Approved:  'bg-emerald-400',
    Rejected:  'bg-red-400',
    Active:    'bg-emerald-400',
    Inactive:  'bg-gray-400',
  };
  return map[status] || 'bg-gray-400';
};

export const actionIcon = (action) => {
  if (action?.includes('CREATED')) return 'plus';
  if (action?.includes('UPDATED')) return 'edit';
  if (action?.includes('DELETED')) return 'trash';
  if (action?.includes('APPROVED')) return 'check';
  if (action?.includes('REJECTED')) return 'x';
  if (action?.includes('SUBMITTED')) return 'send';
  return 'activity';
};

export const actionColor = (action) => {
  if (action?.includes('CREATED') || action?.includes('APPROVED')) return 'text-primary-600 bg-primary-50';
  if (action?.includes('DELETED') || action?.includes('REJECTED')) return 'text-red-600 bg-red-50';
  if (action?.includes('UPDATED') || action?.includes('SUBMITTED')) return 'text-amber-600 bg-amber-50';
  return 'text-charcoal-600 bg-charcoal-100';
};

export const truncate = (str, n = 60) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const buildQueryString = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  return q.toString();
};
