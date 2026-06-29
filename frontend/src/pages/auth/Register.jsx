import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, TrendingUp, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Spinner, FormField } from '../../components/common';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = data;
      await registerUser(rest);
      toast.success('Account created! Welcome to VendorHub.');
      navigate('/dashboard');
    } catch (err) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">VendorHub</h1>
          <p className="text-charcoal-400 mt-1 text-sm">Create your account</p>
        </div>

        <div className="bg-white dark:bg-charcoal-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-1">Get started</h2>
          <p className="text-sm text-charcoal-500 mb-6">Fill in your details to create an account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full name" error={errors.name?.message} required>
              <input
                {...register('name')}
                placeholder="John Smith"
                className={`input ${errors.name ? 'input-error' : ''}`}
              />
            </FormField>

            <FormField label="Email address" error={errors.email?.message} required>
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Password" error={errors.password?.message} required>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Min 6 chars"
                    className={`input pr-9 ${errors.password ? 'input-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm" error={errors.confirmPassword?.message} required>
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Repeat"
                  className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                />
              </FormField>
            </div>

            <FormField label="Account role" error={errors.role?.message}>
              <select {...register('role')} className="input">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 mt-1">
              {loading ? <Spinner size={16} /> : <UserPlus size={16} />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
