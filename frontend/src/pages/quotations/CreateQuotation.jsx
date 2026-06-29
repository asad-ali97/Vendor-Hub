import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import QuotationForm from '../../components/quotations/QuotationForm';

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const vendorId = searchParams.get('vendor');

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await api.post('/quotations', data);
      toast.success('Quotation created successfully');
      navigate(`/quotations/${res.data.quotation._id}`);
    } catch (e) {}
    finally { setLoading(false); }
  };

  return (
    <QuotationForm
      title="Create Quotation"
      defaultValues={vendorId ? { vendor: vendorId, status: 'Pending', currency: 'USD' } : undefined}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
