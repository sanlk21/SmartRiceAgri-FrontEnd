import OrderManagement from '@/components/Orders/OrderManagement';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import OrderDetails from './OrderDetails';
import OrderHistory from './OrderHistory';

const OrderRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER']} />}>
        <Route index element={<OrderManagement />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path=":orderId" element={<OrderDetails />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default OrderRoutes;