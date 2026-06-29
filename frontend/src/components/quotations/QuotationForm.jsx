import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FormField, Spinner } from '../../components/common';

const schema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  description: z.string().optional(),
  vendor: z.string().min(1, 'Please select a vendor'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  submissionDate: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(['Pending', 'Submitted', 'Approved', 'Rejected']).default('Pending'),
  notes: z.string().optional(),
  quotationGroup: z.string().optional(),
});

export default function QuotationForm({ defaultValues, onSubmit, loading, title }) {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { status: 'Pending', currency: 'USD' },
  });

  useEffect(() => {
    api.get('/vendors?limit=100&status=Active')
      .then(({ data }) => setVendors(data.data.vendors))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="page-title mb-6">{title}</h1>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Quotation Title" error={errors.title?.message} required>
            <input
              {...register('title')}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Office Supplies Q3 2024"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={3}
              className="input resize-none"
              placeholder="Describe the scope of this quotation…"
            />
          </FormField>

          <FormField label="Vendor" error={errors.vendor?.message} required>
            <select {...register('vendor')} className={`input ${errors.vendor ? 'input-error' : ''}`}>
              <option value="">Select a vendor…</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vendorName} — {v.companyName}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Amount" error={errors.amount?.message} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount')}
                  className={`input pl-7 ${errors.amount ? 'input-error' : ''}`}
                  placeholder="0.00"
                />
              </div>
            </FormField>
            <FormField label="Currency" error={errors.currency?.message}>
              <select {...register('currency')} className="input">
                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'PKR', 'INR', 'AED'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Submission Date" error={errors.submissionDate?.message}>
              <input
                type="date"
                {...register('submissionDate')}
                className="input"
              />
            </FormField>
            <FormField label="Deadline" error={errors.deadline?.message}>
              <input
                type="date"
                {...register('deadline')}
                className="input"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status" error={errors.status?.message}>
              <select {...register('status')} className="input">
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </FormField>
            <FormField label="Comparison Group ID" error={errors.quotationGroup?.message}>
              <input
                {...register('quotationGroup')}
                className="input"
                placeholder="e.g. grp-office-q1"
              />
            </FormField>
          </div>

          <FormField label="Notes" error={errors.notes?.message}>
            <textarea
              {...register('notes')}
              rows={3}
              className="input resize-none"
              placeholder="Internal notes or conditions…"
            />
          </FormField>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Spinner size={16} /> : <Save size={16} />}
              {loading ? 'Saving…' : 'Save Quotation'}
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
