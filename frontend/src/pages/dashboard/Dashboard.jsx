import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Building2, FileText, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp, Send } from 'lucide-react';
import api from '../../api/axios';
import { StatCard, Spinner } from '../../components/common';
import { formatCurrency, formatDate, statusColor, timeAgo, actionColor } from '../../utils/helpers';

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div>
        <h1 className="page-title text-gradient">Dashboard</h1>
        <p className="page-subtitle">Overview of your vendor management system</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Vendors" value={stats?.vendors.total ?? '—'} icon={Building2} color="primary" loading={loading} />
        <StatCard label="Active Vendors" value={stats?.vendors.active ?? '—'} icon={TrendingUp} color="primary" loading={loading} />
        <StatCard label="Pending Quotes" value={stats?.quotations.pending ?? '—'} icon={Clock} color="amber" loading={loading} />
        <StatCard label="Approved Quotes" value={stats?.quotations.approved ?? '—'} icon={CheckCircle} color="primary" loading={loading} />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Quotations" value={stats?.quotations.total ?? '—'} icon={FileText} color="blue" loading={loading} />
        <StatCard label="Submitted" value={stats?.quotations.submitted ?? '—'} icon={Send} color="blue" loading={loading} />
        <StatCard label="Rejected" value={stats?.quotations.rejected ?? '—'} icon={XCircle} color="red" loading={loading} />
        <StatCard label="Inactive Vendors" value={stats?.vendors.inactive ?? '—'} icon={Building2} color="red" loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-charcoal-800 dark:text-white mb-4">Monthly Quotations</h3>
          {loading ? (
            <div className="h-52 skeleton rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.chartData || []}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 dark:text-white mb-4">Status Distribution</h3>
          {loading ? (
            <div className="h-52 skeleton rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.statusDistribution || []}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(stats?.statusDistribution || []).map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 12 }} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent quotations */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-charcoal-100 dark:border-charcoal-700">
            <h3 className="font-semibold text-charcoal-800 dark:text-white">Recent Quotations</h3>
            <Link to="/quotations" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-charcoal-100 dark:divide-charcoal-700">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3">
                    <div className="skeleton h-4 flex-1 rounded" />
                    <div className="skeleton h-5 w-16 rounded-full" />
                  </div>
                ))
              : stats?.recentQuotations?.length > 0
              ? stats.recentQuotations.map((q) => (
                  <Link key={q._id} to={`/quotations/${q._id}`}
                    className="flex items-center justify-between p-4 hover:bg-charcoal-50 dark:hover:bg-charcoal-700 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal-800 dark:text-white truncate">{q.title}</p>
                      <p className="text-xs text-charcoal-400 mt-0.5">{q.vendor?.companyName} • {formatCurrency(q.amount)}</p>
                    </div>
                    <span className={`badge ml-2 flex-shrink-0 ${statusColor(q.status)}`}>{q.status}</span>
                  </Link>
                ))
              : <p className="p-6 text-sm text-center text-charcoal-400">No quotations yet</p>
            }
          </div>
        </div>

        {/* Recent activities */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-charcoal-100 dark:border-charcoal-700">
            <h3 className="font-semibold text-charcoal-800 dark:text-white">Recent Activity</h3>
            <Link to="/activities" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-charcoal-100 dark:divide-charcoal-700">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3">
                    <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skeleton h-3.5 w-3/4 rounded" />
                      <div className="skeleton h-3 w-1/3 rounded" />
                    </div>
                  </div>
                ))
              : stats?.recentActivities?.length > 0
              ? stats.recentActivities.map((act) => (
                  <div key={act._id} className="flex items-start gap-3 p-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${actionColor(act.action)}`}>
                      {act.entityType === 'vendor' ? 'V' : act.entityType === 'quotation' ? 'Q' : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal-700 dark:text-charcoal-300 leading-snug">{act.description}</p>
                      <p className="text-xs text-charcoal-400 mt-0.5">{timeAgo(act.createdAt)}</p>
                    </div>
                  </div>
                ))
              : <p className="p-6 text-sm text-center text-charcoal-400">No activity yet</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
