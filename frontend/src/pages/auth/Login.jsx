import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, TrendingUp, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Spinner, FormField } from '../../components/common';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      // Handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-900/30">
            <TrendingUp size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">VendorHub</h1>
          <p className="text-charcoal-400 mt-1 text-sm">Vendor Management & Quotation System</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-1">Sign in</h2>
          <p className="text-sm text-charcoal-500 mb-6">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email address" error={errors.email?.message} required>
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter your password"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5 mt-2"
            >
              {loading ? <Spinner size={16} /> : <LogIn size={16} />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
            <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1.5">Demo credentials</p>
            <div className="text-xs text-primary-600 dark:text-primary-400 space-y-0.5">
              <p>📧 admin@vendorsystem.com</p>
              <p>🔑 admin123</p>
            </div>
          </div>

          <p className="text-center text-sm text-charcoal-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
