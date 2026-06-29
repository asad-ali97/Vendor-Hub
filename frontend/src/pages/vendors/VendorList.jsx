import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Building2, Pencil, Trash2, Eye } from 'lucide-react';
import api from '../../api/axios';
import {
  PageHeader, SearchInput, Select, Pagination,
  TableSkeleton, EmptyState, StatusBadge, ConfirmModal,
} from '../../components/common';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function VendorList() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit: 10,
        ...(search && { search }),
        ...(status && { status }),
        sortBy,
      });
      const { data } = await api.get(`/vendors?${params}`);
      setVendors(data.data.vendors);
      setPagination(data.data.pagination);
    } catch (e) {}
    finally { setLoading(false); }
  }, [page, search, status, sortBy]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/vendors/${deleteModal.id}`);
      toast.success('Vendor deleted successfully');
      setDeleteModal({ open: false, id: null, name: '' });
      fetchVendors();
    } catch (e) {}
    finally { setDeleting(false); }
  };

  return (
    <div className="page-wrapper">
      <PageHeader
        title="Vendors"
        subtitle={`${pagination.total} vendor${pagination.total !== 1 ? 's' : ''} in the system`}
        action={
          <Link to="/vendors/add" className="btn btn-primary">
            <Plus size={16} /> Add Vendor
          </Link>
        }
      />

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, company, email…"
            className="flex-1"
          />
          <Select
            value={status}
            onChange={setStatus}
            options={[
              { value: 'Active',   label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            placeholder="All statuses"
            className="w-full sm:w-40"
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'createdAt',   label: 'Newest first' },
              { value: 'vendorName',  label: 'Name A–Z' },
              { value: 'companyName', label: 'Company A–Z' },
            ]}
            placeholder="Sort by"
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Company</th>
                <th>Email</th>
                <th className="hidden md:table-cell">Contact</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : vendors.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={Building2}
                      title="No vendors found"
                      description={
                        search || status
                          ? 'Try adjusting your search or filters'
                          : 'Add your first vendor to get started'
                      }
                      action={
                        !search && !status && (
                          <Link to="/vendors/add" className="btn btn-primary">
                            <Plus size={15} /> Add Vendor
                          </Link>
                        )
                      }
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white dark:bg-charcoal-800 divide-y divide-charcoal-100 dark:divide-charcoal-700">
                {vendors.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {/* Simple initial avatar — no image needed */}
                        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm flex-shrink-0">
                          {v.vendorName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-charcoal-900 dark:text-white">
                          {v.vendorName}
                        </span>
                      </div>
                    </td>
                    <td className="text-charcoal-600 dark:text-charcoal-300">{v.companyName}</td>
                    <td className="text-charcoal-500 dark:text-charcoal-400">{v.email}</td>
                    <td className="hidden md:table-cell text-charcoal-500 dark:text-charcoal-400">
                      {v.contactNumber}
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td className="hidden lg:table-cell text-charcoal-400 text-sm">
                      {formatDate(v.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/vendors/${v._id}`)}
                          className="btn btn-ghost btn-icon btn-sm text-charcoal-500"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/vendors/${v._id}/edit`)}
                          className="btn btn-ghost btn-icon btn-sm text-amber-600"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: v._id, name: v.vendorName })}
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

        {!loading && vendors.length > 0 && (
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
        title="Delete Vendor"
        message={`Are you sure you want to delete "${deleteModal.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
        loading={deleting}
      />
    </div>
  );
}
