import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import VendorForm from '../../components/vendors/VendorForm';
import { Spinner } from '../../components/common';

export default function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/vendors/${id}`)
      .then(({ data }) => setVendor(data.data.vendor))
      .catch(() => navigate('/vendors'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await api.put(`/vendors/${id}`, data);
      toast.success('Vendor updated successfully');
      navigate(`/vendors/${id}`);
    } catch (e) {}
    finally { setSaving(false); }
  };

  if (fetching) {
    return <div className="flex items-center justify-center h-48"><Spinner size={28} className="text-primary-600" /></div>;
  }

  return (
    <VendorForm
      title="Edit Vendor"
      defaultValues={vendor}
      onSubmit={handleSubmit}
      loading={saving}
      vendorId={id}
    />
  );
}
