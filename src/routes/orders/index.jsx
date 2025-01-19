import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Lazy load components for better performance
const OrderManagement = lazy(() => import('../../components/Orders/OrderManagement'));
const OrderDetails = lazy(() => import('../../pages/Orders/OrderDetails'));
const OrderHistory = lazy(() => import('../../pages/Orders/OrderHistory'));

const OrderRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER']} />}>
          <Route index element={<OrderManagement />} />
          <Route path="history" element={<OrderHistory />} />
          <Route path=":orderId" element={<OrderDetails />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="." />} />
      </Routes>
    </Suspense>
  );
};

export default OrderRoutes;