import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import VendorForm from '../../components/vendors/VendorForm';

export default function AddVendor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/vendors', data);
      toast.success('Vendor added successfully');
      navigate('/vendors');
    } catch (e) {}
    finally { setLoading(false); }
  };

  return <VendorForm title="Add New Vendor" onSubmit={handleSubmit} loading={loading} />;
}
