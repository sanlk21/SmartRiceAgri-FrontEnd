import Loading from '@/components/common/Loading';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Lazy load components for better performance
const AdminPaymentDashboard = lazy(() => import('@/components/Payment/AdminPaymentDashboard'));
const AdminPaymentDetails = lazy(() => import('@/components/Payment/AdminPaymentDetails'));
const BuyerPaymentDashboard = lazy(() => import('@/components/Payment/BuyerPaymentDashboard'));
const PaymentOptions = lazy(() => import('@/components/Payment/PaymentOptions'));
const PaymentProcessing = lazy(() => import('@/components/Payment/PaymentProcessing'));
const PaymentStatus = lazy(() => import('@/components/Payment/PaymentStatus'));
const FarmerPaymentDashboard = lazy(() => import('@/components/Payment/FarmerPaymentDashboard'));
const FarmerPaymentDetails = lazy(() => import('@/components/Payment/FarmerPaymentDetails'));

// Route configurations by role
const routeConfig = {
  ADMIN: [
    { path: "", element: <AdminPaymentDashboard /> },
    { path: ":paymentId", element: <AdminPaymentDetails /> }
  ],
  BUYER: [
    { path: "", element: <BuyerPaymentDashboard /> },
    { path: ":paymentId/process", element: <PaymentOptions /> },
    { path: ":paymentId/processing", element: <PaymentProcessing /> },
    { path: ":paymentId/status", element: <PaymentStatus /> },
    { path: ":paymentId", element: <PaymentStatus showNavigation /> }
  ],
  FARMER: [
    { path: "", element: <FarmerPaymentDashboard /> },
    { path: ":paymentId", element: <FarmerPaymentDetails /> }
  ]
};

const PaymentRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rolePrefix = user.role.toLowerCase();

  const renderRoleRoutes = (role) => {
    return routeConfig[role].map(({ path, element }) => (
      <Route
        key={`${role}-${path}`}
        path={`${rolePrefix}/${path}`}
        element={
          <Suspense fallback={<Loading />}>
            {element}
          </Suspense>
        }
      />
    ));
  };

  return (
    <Routes>
      {/* Role-based route protection */}
      <Route element={<ProtectedRoute allowedRoles={[user.role]} />}>
        {/* Role-specific routes */}
        {renderRoleRoutes(user.role)}
      </Route>

      {/* Fallback redirect */}
      <Route 
        path="*" 
        element={<Navigate to={`/payments/${rolePrefix}`} replace />} 
      />
    </Routes>
  );
};

export default PaymentRoutes;