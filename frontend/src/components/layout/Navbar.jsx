import { Menu, Moon, Sun, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[260px] h-16 bg-white dark:bg-charcoal-800 border-b border-charcoal-200 dark:border-charcoal-700 z-20 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost btn-icon text-charcoal-600 dark:text-charcoal-300"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-charcoal-400 dark:text-charcoal-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="btn-ghost btn-icon text-charcoal-500 dark:text-charcoal-400"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropOpen((p) => !p)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-charcoal-100 dark:hover:bg-charcoal-700 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          {dropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-charcoal-800 rounded-xl shadow-lg border border-charcoal-200 dark:border-charcoal-700 z-20 overflow-hidden animate-slide-up">
                <div className="px-4 py-3 border-b border-charcoal-100 dark:border-charcoal-700">
                  <p className="text-sm font-medium text-charcoal-800 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setDropOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-700"
                >
                  <User size={15} /> Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
