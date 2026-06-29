import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, Camera, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormField, Spinner } from '../common';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const schema = z.object({
  vendorName:      z.string().min(2, 'Required').max(100),
  companyName:     z.string().min(2, 'Required').max(100),
  email:           z.string().email('Enter a valid email'),
  contactNumber:   z.string().min(5, 'Required'),
  businessAddress: z.string().min(5, 'Required'),
  category:        z.string().optional(),
  status:          z.enum(['Active', 'Inactive']).default('Active'),
  notes:           z.string().optional(),
});

export default function VendorForm({ defaultValues, onSubmit, loading, title, vendorId }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(defaultValues?.logo || null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { status: 'Active' },
  });

  const logoSrc = logoPreview || (currentLogo
    ? (currentLogo.startsWith('http') ? currentLogo : `${BASE_URL}${currentLogo}`)
    : null);

  const handleLogoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images allowed'); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be under 2MB'); return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload if editing existing vendor
    if (vendorId) {
      setLogoLoading(true);
      const formData = new FormData();
      formData.append('logo', file);
      try {
        const { data } = await api.put(`/vendors/${vendorId}/logo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCurrentLogo(data.data.logoUrl);
        setLogoPreview(null);
        toast.success('Vendor logo updated');
      } catch (e) { setLogoPreview(null); }
      finally { setLogoLoading(false); }
    }
  };

  const handleRemoveLogo = async () => {
    if (vendorId) {
      setLogoLoading(true);
      try {
        await api.delete(`/vendors/${vendorId}/logo`);
        setCurrentLogo(null);
        toast.success('Logo removed');
      } catch (e) {}
      finally { setLogoLoading(false); }
    } else {
      setLogoPreview(null);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="page-title mb-6">{title}</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Logo upload */}
          <div className="flex items-center gap-4 pb-5 border-b border-charcoal-100 dark:border-charcoal-700">
            <div className="relative">
              <div
                onClick={() => !logoLoading && fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl overflow-hidden bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-200 dark:border-primary-700 cursor-pointer hover:border-primary-400 transition-all flex items-center justify-center group"
              >
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={20} className="text-primary-400 group-hover:text-primary-600 transition-colors" />
                )}
                {logoLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Spinner size={16} className="text-white" />
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleLogoSelect} />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">Vendor Logo</p>
              <p className="text-xs text-charcoal-400 mt-0.5">JPEG, PNG, WebP · Max 2MB</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={logoLoading} className="btn btn-outline btn-sm text-xs">
                  {logoSrc ? 'Change' : 'Upload'} Logo
                </button>
                {logoSrc && (
                  <button type="button" onClick={handleRemoveLogo} disabled={logoLoading}
                    className="btn btn-ghost btn-sm text-xs text-red-500">
                    <Trash2 size={11} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Vendor Name" error={errors.vendorName?.message} required>
              <input {...register('vendorName')} className={`input ${errors.vendorName ? 'input-error' : ''}`} placeholder="Full name" />
            </FormField>
            <FormField label="Company Name" error={errors.companyName?.message} required>
              <input {...register('companyName')} className={`input ${errors.companyName ? 'input-error' : ''}`} placeholder="Company Inc." />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Email Address" error={errors.email?.message} required>
              <input type="email" {...register('email')} className={`input ${errors.email ? 'input-error' : ''}`} placeholder="vendor@company.com" />
            </FormField>
            <FormField label="Contact Number" error={errors.contactNumber?.message} required>
              <input {...register('contactNumber')} className={`input ${errors.contactNumber ? 'input-error' : ''}`} placeholder="+1-555-0100" />
            </FormField>
          </div>

          <FormField label="Business Address" error={errors.businessAddress?.message} required>
            <input {...register('businessAddress')} className={`input ${errors.businessAddress ? 'input-error' : ''}`} placeholder="123 Main St, City, State" />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Category" error={errors.category?.message}>
              <select {...register('category')} className="input">
                <option value="">Select category</option>
                {['Technology','Office Supplies','Construction','Logistics','Media','Cleaning','Security','Catering','Printing','Energy','General'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Status" error={errors.status?.message}>
              <select {...register('status')} className="input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>
          </div>

          <FormField label="Notes" error={errors.notes?.message}>
            <textarea {...register('notes')} rows={3} className="input resize-none" placeholder="Optional notes…" />
          </FormField>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Spinner size={16} /> : <Save size={16} />}
              {loading ? 'Saving…' : 'Save Vendor'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
