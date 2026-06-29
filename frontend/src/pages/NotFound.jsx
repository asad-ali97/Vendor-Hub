import { Link } from 'react-router-dom';
import { Home, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-primary-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <TrendingUp size={28} className="text-white" />
        </div>

        {/* 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-charcoal-800 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-7xl font-black text-gradient">404</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-charcoal-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/dashboard" className="btn btn-primary btn-lg mx-auto w-fit">
          <Home size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
