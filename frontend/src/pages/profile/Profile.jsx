import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FormField, Spinner } from '../../components/common';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const passForm = useForm({ resolver: zodResolver(passwordSchema) });

  const handleProfileUpdate = async (data) => {
    setProfileLoading(true);
    try {
      const { data: res } = await api.put('/auth/profile', data);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (e) {}
    finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async (data) => {
    setPassLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      passForm.reset();
    } catch (e) {}
    finally { setPassLoading(false); }
  };

  return (
    <div className="page-wrapper max-w-2xl">
      <h1 className="page-title mb-6">Profile & Settings</h1>

      {/* Identity card */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-charcoal-100 dark:border-charcoal-700">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-charcoal-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-charcoal-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="badge badge-green capitalize">{user?.role}</span>
              <span className="text-xs text-charcoal-400">
                Member since {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <h3 className="font-semibold text-charcoal-800 dark:text-white flex items-center gap-2 mb-4">
          <User size={16} className="text-primary-500" /> Edit Profile
        </h3>
        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
          <FormField label="Full Name" error={profileForm.formState.errors.name?.message} required>
            <input
              {...profileForm.register('name')}
              className={`input ${profileForm.formState.errors.name ? 'input-error' : ''}`}
              placeholder="Your full name"
            />
          </FormField>
          <FormField label="Email Address">
            <input
              value={user?.email}
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-charcoal-400 mt-1">Email cannot be changed</p>
          </FormField>
          <button type="submit" disabled={profileLoading} className="btn btn-primary">
            {profileLoading ? <Spinner size={15} /> : <Save size={15} />}
            {profileLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change password card */}
      <div className="card p-6">
        <h3 className="font-semibold text-charcoal-800 dark:text-white flex items-center gap-2 mb-4">
          <Lock size={16} className="text-primary-500" /> Change Password
        </h3>
        <form onSubmit={passForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <FormField label="Current Password" error={passForm.formState.errors.currentPassword?.message} required>
            <input
              type="password"
              {...passForm.register('currentPassword')}
              className={`input ${passForm.formState.errors.currentPassword ? 'input-error' : ''}`}
              placeholder="Enter current password"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="New Password" error={passForm.formState.errors.newPassword?.message} required>
              <input
                type="password"
                {...passForm.register('newPassword')}
                className={`input ${passForm.formState.errors.newPassword ? 'input-error' : ''}`}
                placeholder="Min 6 characters"
              />
            </FormField>
            <FormField label="Confirm New" error={passForm.formState.errors.confirmPassword?.message} required>
              <input
                type="password"
                {...passForm.register('confirmPassword')}
                className={`input ${passForm.formState.errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repeat password"
              />
            </FormField>
          </div>
          <button type="submit" disabled={passLoading} className="btn btn-primary">
            {passLoading ? <Spinner size={15} /> : <Lock size={15} />}
            {passLoading ? 'Updating…' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6">
        <h3 className="font-semibold text-charcoal-800 dark:text-white flex items-center gap-2 mb-4">
          <Shield size={16} className="text-primary-500" /> Account Information
        </h3>
        <div className="space-y-0">
          {[
            { label: 'User ID',         value: user?._id },
            { label: 'Role',            value: user?.role },
            { label: 'Account Created', value: formatDate(user?.createdAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-charcoal-100 dark:border-charcoal-700 last:border-0">
              <span className="text-sm text-charcoal-500">{label}</span>
              <span className="text-sm font-medium text-charcoal-800 dark:text-charcoal-200 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
