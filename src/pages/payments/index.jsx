import AdminPaymentDashboard from '@/components/Payment/AdminPaymentDashboard';
import BuyerPaymentDashboard from '@/components/Payment/BuyerPaymentDashboard';
import FarmerPaymentDashboard from '@/components/Payment/FarmerPaymentDashboard';
import PaymentStatus from '@/components/Payment/PaymentStatus';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';

const PaymentRoutes = () => {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminPaymentDashboard />;
      case 'FARMER':
        return <FarmerPaymentDashboard />;
      case 'BUYER':
        return <BuyerPaymentDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route index element={getDashboardComponent()} />
      <Route path=":paymentId" element={<PaymentStatus />} />
      <Route path="*" element={<Navigate to="/payments" />} />
    </Routes>
  );
};

export default PaymentRoutes;