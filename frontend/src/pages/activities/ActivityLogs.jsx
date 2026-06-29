import { useState, useEffect, useCallback } from 'react';
import { Activity, Building2, FileText, User as UserIcon } from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, Select, Pagination, Spinner, EmptyState } from '../../components/common';
import { timeAgo, formatDatetime, actionColor } from '../../utils/helpers';

const entityIcons = {
  vendor:    Building2,
  quotation: FileText,
  user:      UserIcon,
  system:    Activity,
};

const actionLabels = {
  VENDOR_CREATED:    'Vendor Added',
  VENDOR_UPDATED:    'Vendor Updated',
  VENDOR_DELETED:    'Vendor Deleted',
  QUOTATION_CREATED: 'Quotation Created',
  QUOTATION_UPDATED: 'Quotation Updated',
  QUOTATION_DELETED: 'Quotation Deleted',
  QUOTATION_APPROVED:'Quotation Approved',
  QUOTATION_REJECTED:'Quotation Rejected',
  QUOTATION_SUBMITTED:'Quotation Submitted',
  USER_REGISTERED:   'User Registered',
};

export default function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(entityType && { entityType }) });
      const { data } = await api.get(`/activities?${params}`);
      setActivities(data.data.activities);
      setPagination(data.data.pagination);
    } catch (e) {}
    finally { setLoading(false); }
  }, [page, entityType]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  return (
    <div className="page-wrapper">
      <PageHeader
        title="Activity Logs"
        subtitle={`${pagination.total} recorded action${pagination.total !== 1 ? 's' : ''}`}
      />

      {/* Filter */}
      <div className="card p-4 flex gap-3">
        <Select
          value={entityType}
          onChange={(v) => { setEntityType(v); setPage(1); }}
          options={[
            { value: 'vendor',    label: 'Vendors' },
            { value: 'quotation', label: 'Quotations' },
            { value: 'user',      label: 'Users' },
          ]}
          placeholder="All entity types"
          className="w-52"
        />
        {entityType && (
          <button onClick={() => setEntityType('')} className="btn btn-ghost btn-sm text-charcoal-500">
            Clear filter
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={28} className="text-primary-600" />
          </div>
        ) : activities.length === 0 ? (
          <EmptyState illustration="activities" title="No activities yet" description="Actions will appear here as you use the system" />
        ) : (
          <>
            <div className="divide-y divide-charcoal-100 dark:divide-charcoal-700">
              {activities.map((act, idx) => {
                const Icon = entityIcons[act.entityType] || Activity;
                const colors = actionColor(act.action);
                return (
                  <div key={act._id} className="flex items-start gap-4 p-4 hover:bg-charcoal-50 dark:hover:bg-charcoal-700/50 transition-colors">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colors}`}>
                      <Icon size={16} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide text-charcoal-400 dark:text-charcoal-500">
                            {actionLabels[act.action] || act.action}
                          </span>
                          <p className="text-sm text-charcoal-800 dark:text-charcoal-200 mt-0.5 leading-snug">
                            {act.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-charcoal-400">{timeAgo(act.createdAt)}</p>
                          <p className="text-xs text-charcoal-300 dark:text-charcoal-600 mt-0.5 hidden sm:block">
                            {formatDatetime(act.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* User badge */}
                      {act.user && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="w-4 h-4 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                            <UserIcon size={9} className="text-primary-600" />
                          </div>
                          <span className="text-xs text-charcoal-400">{act.user?.name || 'System'}</span>
                          {act.entityType && (
                            <>
                              <span className="text-charcoal-300">·</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${colors}`}>
                                {act.entityType}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-charcoal-100 dark:border-charcoal-700">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
