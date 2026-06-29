import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, CheckCircle, XCircle,
  Download, Send, Calendar, DollarSign, Building2, User, FileText
} from 'lucide-react';
import api from '../../api/axios';
import { Spinner, StatusBadge, ConfirmModal } from '../../components/common';
import { formatDate, formatCurrency, formatDatetime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchQuotation = async () => {
    try {
      const { data } = await api.get(`/quotations/${id}`);
      setQuotation(data.data.quotation);
    } catch { navigate('/quotations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQuotation(); }, [id]);

  const handleStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const { data } = await api.patch(`/quotations/${id}/status`, { status });
      setQuotation(data.data.quotation);
      toast.success(`Quotation ${status.toLowerCase()}`);
    } catch (e) {}
    finally { setUpdatingStatus(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/quotations/${id}`);
      toast.success('Quotation deleted');
      navigate('/quotations');
    } catch {} finally { setDeleting(false); }
  };

  const exportPDF = () => {
    if (!quotation) return;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 27, { align: 'center' });

    // Reset color
    doc.setTextColor(30, 41, 59);

    // Quotation details table
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Quotation Details', 15, 48);

    doc.autoTable({
      startY: 53,
      head: [],
      body: [
        ['Title', quotation.title],
        ['Status', quotation.status],
        ['Amount', formatCurrency(quotation.amount, quotation.currency)],
        ['Submission Date', quotation.submissionDate ? formatDate(quotation.submissionDate) : 'N/A'],
        ['Deadline', quotation.deadline ? formatDate(quotation.deadline) : 'N/A'],
        ['Group ID', quotation.quotationGroup || 'N/A'],
        ['Description', quotation.description || 'N/A'],
        ['Notes', quotation.notes || 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45, fillColor: [236, 253, 245] },
        1: { cellWidth: 135 },
      },
    });

    // Vendor section
    const vendorY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Vendor Information', 15, vendorY);

    doc.autoTable({
      startY: vendorY + 5,
      head: [],
      body: [
        ['Vendor Name', quotation.vendor?.vendorName || 'N/A'],
        ['Company', quotation.vendor?.companyName || 'N/A'],
        ['Email', quotation.vendor?.email || 'N/A'],
        ['Contact', quotation.vendor?.contactNumber || 'N/A'],
        ['Address', quotation.vendor?.businessAddress || 'N/A'],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 45, fillColor: [236, 253, 245] },
        1: { cellWidth: 135 },
      },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('VendorHub — Vendor Management & Quotation System', 105, pageHeight - 10, { align: 'center' });

    doc.save(`quotation-${quotation.title.replace(/\s+/g, '-')}.pdf`);
    toast.success('PDF exported successfully');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><Spinner size={28} className="text-primary-600" /></div>;
  }
  if (!quotation) return null;

  const canApprove = quotation.status === 'Submitted';
  const canSubmit = quotation.status === 'Pending';

  return (
    <div className="page-wrapper max-w-3xl">
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={() => navigate('/quotations')} className="btn btn-ghost text-charcoal-600">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {canSubmit && (
            <button onClick={() => handleStatus('Submitted')} disabled={updatingStatus} className="btn btn-amber btn-sm">
              {updatingStatus ? <Spinner size={14} /> : <Send size={14} />} Mark Submitted
            </button>
          )}
          {canApprove && (
            <>
              <button onClick={() => handleStatus('Approved')} disabled={updatingStatus} className="btn btn-primary btn-sm">
                {updatingStatus ? <Spinner size={14} /> : <CheckCircle size={14} />} Approve
              </button>
              <button onClick={() => handleStatus('Rejected')} disabled={updatingStatus} className="btn btn-danger btn-sm">
                {updatingStatus ? <Spinner size={14} /> : <XCircle size={14} />} Reject
              </button>
            </>
          )}
          <button onClick={exportPDF} className="btn btn-outline btn-sm">
            <Download size={14} /> Export PDF
          </button>
          <Link to={`/quotations/${id}/edit`} className="btn btn-outline btn-sm">
            <Pencil size={14} /> Edit
          </Link>
          <button onClick={() => setDeleteModal(true)} className="btn btn-danger btn-sm">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h1 className="text-xl font-bold text-charcoal-900 dark:text-white">{quotation.title}</h1>
            {quotation.description && (
              <p className="text-charcoal-500 text-sm mt-1 max-w-lg">{quotation.description}</p>
            )}
          </div>
          <StatusBadge status={quotation.status} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoTile icon={DollarSign} label="Amount" value={formatCurrency(quotation.amount, quotation.currency)} accent />
          <InfoTile icon={Calendar} label="Submission" value={quotation.submissionDate ? formatDate(quotation.submissionDate) : '—'} />
          <InfoTile icon={Calendar} label="Deadline" value={quotation.deadline ? formatDate(quotation.deadline) : '—'} />
          <InfoTile icon={FileText} label="Group" value={quotation.quotationGroup || '—'} />
        </div>

        {quotation.notes && (
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 uppercase tracking-wide">Notes</p>
            <p className="text-sm text-amber-900 dark:text-amber-300">{quotation.notes}</p>
          </div>
        )}
      </div>

      {/* Vendor card */}
      <div className="card p-6">
        <h3 className="font-semibold text-charcoal-800 dark:text-white flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-primary-500" /> Assigned Vendor
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-700 text-lg font-bold flex-shrink-0">
            {quotation.vendor?.vendorName?.charAt(0)}
          </div>
          <div className="flex-1">
            <Link to={`/vendors/${quotation.vendor?._id}`} className="font-semibold text-primary-600 hover:underline">
              {quotation.vendor?.vendorName}
            </Link>
            <p className="text-sm text-charcoal-500">{quotation.vendor?.companyName}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{quotation.vendor?.email} · {quotation.vendor?.contactNumber}</p>
          </div>
          <StatusBadge status={quotation.vendor?.status} />
        </div>
      </div>

      {/* Meta */}
      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">Created by</p>
            <p className="text-charcoal-700 dark:text-charcoal-300 font-medium">{quotation.createdBy?.name || '—'}</p>
            <p className="text-xs text-charcoal-400">{formatDatetime(quotation.createdAt)}</p>
          </div>
          {quotation.approvedBy && (
            <div>
              <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">
                {quotation.status === 'Approved' ? 'Approved' : 'Reviewed'} by
              </p>
              <p className="text-charcoal-700 dark:text-charcoal-300 font-medium">{quotation.approvedBy?.name}</p>
              <p className="text-xs text-charcoal-400">{formatDatetime(quotation.approvedAt)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">Last updated</p>
            <p className="text-charcoal-700 dark:text-charcoal-300">{formatDatetime(quotation.updatedAt)}</p>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteModal}
        title="Delete Quotation"
        message={`Delete "${quotation.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
      />
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, accent }) {
  return (
    <div className={`p-3.5 rounded-xl ${accent ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-charcoal-50 dark:bg-charcoal-700/50'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={13} className={accent ? 'text-primary-600' : 'text-charcoal-400'} />
        <span className="text-xs text-charcoal-400 font-medium">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${accent ? 'text-primary-700 dark:text-primary-300' : 'text-charcoal-800 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}
