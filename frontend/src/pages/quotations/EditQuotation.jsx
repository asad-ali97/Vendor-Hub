import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import QuotationForm from '../../components/quotations/QuotationForm';
import { Spinner } from '../../components/common';

export default function EditQuotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/quotations/${id}`)
      .then(({ data }) => {
        const q = data.data.quotation;
        setQuotation({
          ...q,
          vendor: q.vendor?._id || q.vendor,
          submissionDate: q.submissionDate
            ? new Date(q.submissionDate).toISOString().split('T')[0]
            : '',
          deadline: q.deadline
            ? new Date(q.deadline).toISOString().split('T')[0]
            : '',
        });
      })
      .catch(() => navigate('/quotations'))
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await api.put(`/quotations/${id}`, data);
      toast.success('Quotation updated');
      navigate(`/quotations/${id}`);
    } catch (e) {}
    finally { setSaving(false); }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size={28} className="text-primary-600" />
      </div>
    );
  }

  return (
    <QuotationForm
      title="Edit Quotation"
      defaultValues={quotation}
      onSubmit={handleSubmit}
      loading={saving}
    />
  );
}
