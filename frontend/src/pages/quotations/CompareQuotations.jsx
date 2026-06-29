import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Trophy, TrendingDown, Search, Download, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';
import { PageHeader, SearchInput, StatusBadge, Spinner, EmptyState } from '../../components/common';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function CompareQuotations() {
  const [groupId, setGroupId] = useState('');
  const [inputGroupId, setInputGroupId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Load all unique quotation groups
  useEffect(() => {
    api.get('/quotations?limit=200')
      .then(({ data: res }) => {
        const groups = [...new Set(
          res.data.quotations
            .filter((q) => q.quotationGroup)
            .map((q) => q.quotationGroup)
        )];
        setAllGroups(groups);
      })
      .catch(() => {})
      .finally(() => setLoadingGroups(false));
  }, []);

  const fetchComparison = async (gid) => {
    if (!gid?.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const { data: res } = await api.get(`/quotations/compare/${gid.trim()}`);
      setData(res.data);
    } catch (e) {
      toast.error('No quotations found for this group ID');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setGroupId(inputGroupId);
    fetchComparison(inputGroupId);
  };

  const handleStatusChange = async (qId, status) => {
    try {
      await api.patch(`/quotations/${qId}/status`, { status });
      toast.success(`Quotation ${status.toLowerCase()}`);
      fetchComparison(groupId || inputGroupId);
    } catch (e) {}
  };

  const exportComparisonPDF = () => {
    if (!data) return;
    const doc = new jsPDF();

    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION COMPARISON REPORT', 105, 17, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Group: ${data.group}  |  Generated: ${new Date().toLocaleDateString()}`, 105, 27, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 15, 48);

    doc.autoTable({
      startY: 53,
      head: [],
      body: [
        ['Total Quotations', String(data.total)],
        ['Lowest Amount', formatCurrency(data.lowestAmount)],
        ['Highest Amount', formatCurrency(data.highestAmount)],
        ['Average Amount', formatCurrency(data.averageAmount)],
        ['Best Vendor', `${data.cheapestVendor?.vendorName} (${data.cheapestVendor?.companyName})`],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [236, 253, 245], cellWidth: 50 },
      },
    });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Quotation Breakdown', 15, doc.lastAutoTable.finalY + 12);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 17,
      head: [['#', 'Title', 'Vendor', 'Company', 'Amount', 'Status', 'Date']],
      body: data.quotations.map((q, i) => [
        i + 1,
        q.title,
        q.vendor?.vendorName || '—',
        q.vendor?.companyName || '—',
        formatCurrency(q.amount),
        q.status,
        q.submissionDate ? formatDate(q.submissionDate) : '—',
      ]),
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [5, 150, 105] },
      didParseCell: (hookData) => {
        if (hookData.row.index === 0 && hookData.section === 'body') {
          hookData.cell.styles.fillColor = [209, 250, 229];
          hookData.cell.styles.fontStyle = 'bold';
        }
      },
    });

    const ph = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('VendorHub — Vendor Management & Quotation System', 105, ph - 10, { align: 'center' });

    doc.save(`comparison-${data.group}.pdf`);
    toast.success('Comparison PDF exported');
  };

  return (
    <div className="page-wrapper">
      <PageHeader
        title="Compare Quotations"
        subtitle="Compare multiple vendor bids side-by-side to find the best value"
        action={
          data && (
            <button onClick={exportComparisonPDF} className="btn btn-outline">
              <Download size={15} /> Export PDF
            </button>
          )
        }
      />

      {/* Group selector */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-3">
          Enter Quotation Group ID to compare
        </h3>
        <div className="flex gap-3">
          <input
            value={inputGroupId}
            onChange={(e) => setInputGroupId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="input flex-1"
            placeholder="e.g. grp-office-supplies-2024"
          />
          <button onClick={handleSearch} disabled={loading || !inputGroupId.trim()} className="btn btn-primary">
            {loading ? <Spinner size={16} /> : <Search size={16} />}
            Compare
          </button>
        </div>

        {/* Quick group pills */}
        {!loadingGroups && allGroups.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-charcoal-400 mb-2">Available groups:</p>
            <div className="flex flex-wrap gap-2">
              {allGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => { setInputGroupId(g); fetchComparison(g); setGroupId(g); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    (groupId || inputGroupId) === g
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-charcoal-50 text-charcoal-600 border-charcoal-200 hover:bg-primary-50 hover:border-primary-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size={32} className="text-primary-600" />
        </div>
      )}

      {/* Results */}
      {!loading && data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard label="Total Bids" value={data.total} icon={GitCompare} />
            <SummaryCard label="Lowest Bid" value={formatCurrency(data.lowestAmount)} icon={TrendingDown} accent="green" />
            <SummaryCard label="Highest Bid" value={formatCurrency(data.highestAmount)} icon={TrendingDown} accent="red" />
            <SummaryCard label="Average" value={formatCurrency(data.averageAmount)} icon={GitCompare} accent="amber" />
          </div>

          {/* Best vendor banner */}
          <div className="card p-5 border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide">Most Cost-Effective</p>
                <p className="font-bold text-charcoal-900 dark:text-white">
                  {data.cheapestVendor?.vendorName} — {data.cheapestVendor?.companyName}
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Bid: {formatCurrency(data.lowestAmount)} · Saves {formatCurrency(data.highestAmount - data.lowestAmount)} vs highest
                </p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-charcoal-100 dark:border-charcoal-700">
              <h3 className="font-semibold text-charcoal-800 dark:text-white">Vendor Bids Breakdown</h3>
              <p className="text-xs text-charcoal-400 mt-0.5">Sorted by amount (lowest first). 🏆 = best value</p>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Quotation</th>
                    <th>Vendor</th>
                    <th>Company</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="hidden md:table-cell">Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-charcoal-800 divide-y divide-charcoal-100 dark:divide-charcoal-700">
                  {data.quotations.map((q, idx) => {
                    const isBest = q.amount === data.lowestAmount;
                    return (
                      <tr key={q._id} className={isBest ? 'bg-primary-50 dark:bg-primary-900/10' : ''}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isBest ? 'bg-amber-400 text-white' : 'bg-charcoal-100 dark:bg-charcoal-700 text-charcoal-500'}`}>
                              {isBest ? '🏆' : idx + 1}
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/quotations/${q._id}`} className="text-primary-600 hover:underline font-medium text-sm">
                            {q.title}
                          </Link>
                        </td>
                        <td className="font-medium text-charcoal-800 dark:text-white">{q.vendor?.vendorName}</td>
                        <td className="text-charcoal-500">{q.vendor?.companyName}</td>
                        <td>
                          <span className={`font-bold text-sm ${isBest ? 'text-primary-600' : 'text-charcoal-800 dark:text-white'}`}>
                            {formatCurrency(q.amount)}
                          </span>
                          {isBest && <span className="ml-1 text-xs text-primary-500">lowest</span>}
                        </td>
                        <td><StatusBadge status={q.status} /></td>
                        <td className="hidden md:table-cell text-charcoal-400 text-sm">
                          {q.submissionDate ? formatDate(q.submissionDate) : '—'}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !data && (
        <EmptyState
          illustration="comparison"
          title="No comparison yet"
          description="Enter a group ID above or select from available groups to compare quotations"
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, accent }) {
  const colors = {
    green: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
    red:   'bg-red-50 dark:bg-red-900/20 text-red-600',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  };
  return (
    <div className={`card p-4 ${colors[accent] || ''}`}>
      <p className="text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-bold text-charcoal-900 dark:text-white">{value}</p>
    </div>
  );
}
