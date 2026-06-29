import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Pencil, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';
import {
  PageHeader, SearchInput, Select, Pagination,
  TableSkeleton, EmptyState, StatusBadge, ConfirmModal
} from '../../components/common';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function QuotationList() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 10,
        ...(search && { search }),
        ...(status && { status }),
        sortBy, sortOrder,
        ...(minAmount && { minAmount }),
        ...(maxAmount && { maxAmount }),
      });
      const { data } = await api.get(`/quotations?${params}`);
      setQuotations(data.data.quotations);
      setPagination(data.data.pagination);
    } catch (e) {}
    finally { setLoading(false); }
  }, [page, search, status, sortBy, sortOrder, minAmount, maxAmount]);

  useEffect(() => { fetchQuotations(); }, [fetchQuotations]);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/quotations/${deleteModal.id}`);
      toast.success('Quotation deleted');
      setDeleteModal({ open: false, id: null, title: '' });
      fetchQuotations();
    } catch (e) {}
    finally { setDeleting(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/quotations/${id}/status`, { status: newStatus });
      toast.success(`Quotation ${newStatus.toLowerCase()}`);
      fetchQuotations();
    } catch (e) {}
  };

  return (
    <div className="page-wrapper">
      <PageHeader
        title="Quotations"
        subtitle={`${pagination.total} quotation${pagination.total !== 1 ? 's' : ''} total`}
        action={
          <Link to="/quotations/create" className="btn btn-primary">
            <Plus size={16} /> New Quotation
          </Link>
        }
      />

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search quotations…"
            className="flex-1"
          />
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={[
              { value: 'Pending', label: 'Pending' },
              { value: 'Submitted', label: 'Submitted' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
            placeholder="All statuses"
            className="w-full sm:w-40"
          />
          <Select
            value={`${sortBy}:${sortOrder}`}
            onChange={(v) => {
              const [sb, so] = v.split(':');
              setSortBy(sb); setSortOrder(so);
            }}
            options={[
              { value: 'createdAt:desc', label: 'Newest first' },
              { value: 'createdAt:asc',  label: 'Oldest first' },
              { value: 'amount:asc',     label: 'Amount: Low → High' },
              { value: 'amount:desc',    label: 'Amount: High → Low' },
            ]}
            placeholder="Sort by"
            className="w-full sm:w-48"
          />
        </div>
        {/* Amount range */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-500 font-medium">Amount:</span>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => { setMinAmount(e.target.value); setPage(1); }}
            placeholder="Min"
            className="input w-28 text-sm py-1.5"
          />
          <span className="text-charcoal-400">–</span>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => { setMaxAmount(e.target.value); setPage(1); }}
            placeholder="Max"
            className="input w-28 text-sm py-1.5"
          />
          {(minAmount || maxAmount) && (
            <button
              onClick={() => { setMinAmount(''); setMaxAmount(''); }}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Submission</th>
                <th className="hidden md:table-cell">Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : quotations.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      illustration="quotations"
                      title="No quotations found"
                      description={search || status ? 'Try clearing filters' : 'Create your first quotation'}
                      action={!search && !status && (
                        <Link to="/quotations/create" className="btn btn-primary">
                          <Plus size={15} /> New Quotation
                        </Link>
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white dark:bg-charcoal-800 divide-y divide-charcoal-100 dark:divide-charcoal-700">
                {quotations.map((q) => (
                  <tr key={q._id}>
                    <td>
                      <div>
                        <p className="font-medium text-charcoal-900 dark:text-white max-w-[200px] truncate">{q.title}</p>
                        {q.quotationGroup && (
                          <span className="text-xs text-charcoal-400">Group: {q.quotationGroup.slice(0, 12)}…</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">{q.vendor?.vendorName}</p>
                        <p className="text-xs text-charcoal-400">{q.vendor?.companyName}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-charcoal-900 dark:text-white">
                      {formatCurrency(q.amount)}
                    </td>
                    <td><StatusBadge status={q.status} /></td>
                    <td className="hidden lg:table-cell text-charcoal-400 text-sm">
                      {q.submissionDate ? formatDate(q.submissionDate) : <span className="text-charcoal-300">—</span>}
                    </td>
                    <td className="hidden md:table-cell text-charcoal-400 text-sm">
                      {formatDate(q.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/quotations/${q._id}`)} className="btn btn-ghost btn-icon btn-sm text-charcoal-500" title="View">
                          <Eye size={15} />
                        </button>
                        {q.status === 'Submitted' && (
                          <>
                            <button onClick={() => handleStatusChange(q._id, 'Approved')} className="btn btn-ghost btn-icon btn-sm text-primary-600" title="Approve">
                              <CheckCircle size={15} />
                            </button>
                            <button onClick={() => handleStatusChange(q._id, 'Rejected')} className="btn btn-ghost btn-icon btn-sm text-red-500" title="Reject">
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button onClick={() => navigate(`/quotations/${q._id}/edit`)} className="btn btn-ghost btn-icon btn-sm text-amber-600" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: q._id, title: q.title })}
                          className="btn btn-ghost btn-icon btn-sm text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {!loading && quotations.length > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Quotation"
        message={`Delete "${deleteModal.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        loading={deleting}
      />
    </div>
  );
}
