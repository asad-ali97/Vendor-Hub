import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common';

import Layout from '../components/layout/Layout';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Vendors
import VendorList from '../pages/vendors/VendorList';
import AddVendor from '../pages/vendors/AddVendor';
import EditVendor from '../pages/vendors/EditVendor';
import VendorDetails from '../pages/vendors/VendorDetails';

// Quotations
import QuotationList from '../pages/quotations/QuotationList';
import CreateQuotation from '../pages/quotations/CreateQuotation';
import EditQuotation from '../pages/quotations/EditQuotation';
import QuotationDetails from '../pages/quotations/QuotationDetails';
import CompareQuotations from '../pages/quotations/CompareQuotations';

// Other
import ActivityLogs from '../pages/activities/ActivityLogs';
import Profile from '../pages/profile/Profile';
import NotFound from '../pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size={36} className="text-primary-600 mx-auto mb-3" />
          <p className="text-sm text-charcoal-500">Loading VendorHub…</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Vendors */}
        <Route path="vendors" element={<VendorList />} />
        <Route path="vendors/add" element={<AddVendor />} />
        <Route path="vendors/:id" element={<VendorDetails />} />
        <Route path="vendors/:id/edit" element={<EditVendor />} />

        {/* Quotations */}
        <Route path="quotations" element={<QuotationList />} />
        <Route path="quotations/create" element={<CreateQuotation />} />
        <Route path="quotations/:id" element={<QuotationDetails />} />
        <Route path="quotations/:id/edit" element={<EditQuotation />} />
        <Route path="compare" element={<CompareQuotations />} />

        {/* Other */}
        <Route path="activities" element={<ActivityLogs />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
