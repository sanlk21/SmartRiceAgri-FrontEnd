import PaymentHistory from '@/components/Payment/PaymentHistory';
import PaymentStatus from '@/components/Payment/PaymentStatus';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';

const PaymentRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER']} />}>
        <Route index element={<PaymentHistory />} />
        <Route path=":paymentId" element={<PaymentStatus />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/payments" />} />
    </Routes>
  );
};

export default PaymentRoutes;