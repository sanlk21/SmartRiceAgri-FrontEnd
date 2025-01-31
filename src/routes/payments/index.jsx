import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';

// Admin Components
import AdminPaymentDashboard from '@/components/Payment/AdminPaymentDashboard';
import AdminPaymentDetails from '@/components/Payment/AdminPaymentDetails';

// Buyer Components
import BuyerPaymentDashboard from '@/components/Payment/BuyerPaymentDashboard';
import PaymentStatus from '@/components/Payment/PaymentStatus';
import PaymentOptions from '@/components/Payment/PendingPayments/PaymentOptions';

// Farmer Components
import FarmerPaymentDashboard from '@/components/Payment/FarmerPaymentDashboard';
import FarmerPaymentDetails from '@/components/Payment/FarmerPaymentDetails';

const PaymentRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="admin" element={<AdminPaymentDashboard />} />
        <Route path="admin/:paymentId" element={<AdminPaymentDetails />} />
      </Route>

      {/* Buyer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
        <Route path="buyer" element={<BuyerPaymentDashboard />} />
        <Route path="buyer/payments/:paymentId/process" element={<PaymentOptions />} />
        <Route path="buyer/payments/:paymentId/status" element={<PaymentStatus />} />
      </Route>

      {/* Farmer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
        <Route path="farmer" element={<FarmerPaymentDashboard />} />
        <Route path="farmer/:paymentId" element={<FarmerPaymentDetails />} />
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={
        <Navigate to={`/payments/${user.role.toLowerCase()}`} replace />
      } />
    </Routes>
  );
};

export default PaymentRoutes;