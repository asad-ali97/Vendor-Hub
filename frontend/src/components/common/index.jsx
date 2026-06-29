import { Loader2, ChevronLeft, ChevronRight, Search, AlertCircle } from 'lucide-react';
import { statusColor } from '../../utils/helpers';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}

// ── Table skeleton rows ───────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-charcoal-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="skeleton h-4 rounded" style={{ width: `${60 + (j * 7) % 30}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={52} className="empty-state-icon" />}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  return <span className={statusColor(status)}>{status}</span>;
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange, total, limit }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  // Build page numbers: show up to 5 around current page
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end   = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-between px-2 py-3 flex-wrap gap-2">
      <p className="text-sm text-charcoal-500">
        Showing <span className="font-medium">{from}–{to}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn btn-outline btn-sm px-2 py-1.5 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn btn-sm px-3 py-1.5 min-w-[36px] ${p === page ? 'btn-primary' : 'btn-outline'}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn btn-outline btn-sm px-2 py-1.5 disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Search input ──────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, danger = true }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box p-6 max-w-sm">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          danger ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          <AlertCircle size={24} className={danger ? 'text-red-600' : 'text-amber-600'} />
        </div>
        <h3 className="text-lg font-semibold text-center text-charcoal-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-charcoal-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-outline flex-1" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-amber'}`}
          >
            {loading ? <Spinner size={16} /> : null} Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Select dropdown ───────────────────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder = 'Select…', className = '' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input ${className}`}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  );
}

// ── Page header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'primary', loading }) {
  const colors = {
    primary: { bg: 'bg-primary-100 dark:bg-primary-900/30', text: 'text-primary-600' },
    amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-600' },
    red:     { bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-600' },
    blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-600' },
  };
  const c = colors[color] || colors.primary;

  return (
    <div className="stat-card card">
      <div className={`stat-icon ${c.bg}`}>
        <Icon size={22} className={c.text} />
      </div>
      <div>
        <p className="stat-label dark:text-charcoal-400">{label}</p>
        {loading
          ? <div className="skeleton h-7 w-16 mt-1 rounded" />
          : <p className="stat-value">{value}</p>
        }
      </div>
    </div>
  );
}

// ── Form field wrapper ────────────────────────────────────────────────────────
export function FormField({ label, error, children, required }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="error-text">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
