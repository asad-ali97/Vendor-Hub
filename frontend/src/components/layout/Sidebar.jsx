import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FileText, GitCompare,
  Activity, Settings, X, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vendors',    icon: Building2,        label: 'Vendors' },
  { to: '/quotations', icon: FileText,          label: 'Quotations' },
  { to: '/compare',    icon: GitCompare,        label: 'Compare' },
  { to: '/activities', icon: Activity,          label: 'Activity Logs' },
  { to: '/profile',    icon: Settings,          label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`sidebar ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-charcoal-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">VendorHub</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-charcoal-400 hover:text-white p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 space-y-0.5 overflow-y-auto scrollbar-thin">
          <p className="px-5 text-xs font-semibold uppercase tracking-widest text-charcoal-500 mb-3">
            Main Menu
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-charcoal-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
            </div>
            <span className="badge bg-primary-900/50 text-primary-300 text-[10px] px-2 py-0.5 capitalize flex-shrink-0">
              {user?.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
