import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft, Mail, Phone, MapPin, Tag, Calendar, FileText } from 'lucide-react';
import api from '../../api/axios';
import { Spinner, StatusBadge, ConfirmModal, EmptyState } from '../../components/common';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ data: vd }, { data: qd }] = await Promise.all([
          api.get(`/vendors/${id}`),
          api.get(`/quotations?vendor=${id}&limit=5`),
        ]);
        setVendor(vd.data.vendor);
        setQuotations(qd.data.quotations);
      } catch { navigate('/vendors'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/vendors/${id}`);
      toast.success('Vendor deleted');
      navigate('/vendors');
    } catch {} finally { setDeleting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><Spinner size={28} className="text-primary-600" /></div>;
  if (!vendor) return null;

  return (
    <div className="page-wrapper max-w-4xl">
      {/* Back button + actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button onClick={() => navigate('/vendors')} className="btn btn-ghost text-charcoal-600">
          <ArrowLeft size={16} /> Back to Vendors
        </button>
        <div className="flex gap-2">
          <Link to={`/vendors/${id}/edit`} className="btn btn-outline"><Pencil size={15} /> Edit</Link>
          <button onClick={() => setDeleteModal(true)} className="btn btn-danger"><Trash2 size={15} /> Delete</button>
        </div>
      </div>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-700 text-2xl font-bold flex-shrink-0">
            {vendor.vendorName?.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-charcoal-900 dark:text-white">{vendor.vendorName}</h2>
              <StatusBadge status={vendor.status} />
            </div>
            <p className="text-charcoal-500 mt-0.5">{vendor.companyName}</p>
            {vendor.category && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                <Tag size={11} /> {vendor.category}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <InfoRow icon={Mail} label="Email" value={vendor.email} />
          <InfoRow icon={Phone} label="Phone" value={vendor.contactNumber} />
          <InfoRow icon={MapPin} label="Address" value={vendor.businessAddress} />
          <InfoRow icon={Calendar} label="Added" value={formatDate(vendor.createdAt)} />
        </div>

        {vendor.notes && (
          <div className="mt-5 p-4 bg-charcoal-50 dark:bg-charcoal-700 rounded-xl">
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-sm text-charcoal-700 dark:text-charcoal-300">{vendor.notes}</p>
          </div>
        )}
      </div>

      {/* Related quotations */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-charcoal-100 dark:border-charcoal-700">
          <h3 className="font-semibold text-charcoal-800 dark:text-white flex items-center gap-2">
            <FileText size={16} className="text-primary-500" /> Quotations
          </h3>
          <Link to={`/quotations/create?vendor=${id}`} className="btn btn-primary btn-sm">+ New</Link>
        </div>
        {quotations.length === 0 ? (
          <EmptyState icon={FileText} title="No quotations yet" description="Create a quotation for this vendor" />
        ) : (
          <table className="table">
            <thead><tr><th>Title</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody className="bg-white dark:bg-charcoal-800 divide-y divide-charcoal-100 dark:divide-charcoal-700">
              {quotations.map((q) => (
                <tr key={q._id}>
                  <td><Link to={`/quotations/${q._id}`} className="text-primary-600 hover:underline font-medium">{q.title}</Link></td>
                  <td className="font-medium">{formatCurrency(q.amount)}</td>
                  <td><StatusBadge status={q.status} /></td>
                  <td className="text-charcoal-400">{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        open={deleteModal}
        title="Delete Vendor"
        message={`Delete "${vendor.vendorName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-primary-600" />
      </div>
      <div>
        <p className="text-xs text-charcoal-400 font-medium">{label}</p>
        <p className="text-sm text-charcoal-800 dark:text-white mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}
