import Loading from '@/components/common/Loading';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Common components
const PaymentStatus = lazy(() => import('@/components/Payment/PaymentStatus'));

// Admin components
const AdminPaymentDashboard = lazy(() => import('@/components/Payment/AdminPaymentDashboard'));
const AdminPaymentDetails = lazy(() => import('@/components/Payment/AdminPaymentDetails'));

// Buyer components
const BuyerPaymentDashboard = lazy(() => import('@/components/Payment/BuyerPaymentDashboard'));
const PaymentOptions = lazy(() => import('@/components/Payment/PaymentOptions'));
const PaymentProcessing = lazy(() => import('@/components/Payment/PaymentProcessing'));

// Farmer components
const FarmerPaymentDashboard = lazy(() => import('@/components/Payment/FarmerPaymentDashboard'));
const FarmerPaymentDetails = lazy(() => import('@/components/Payment/FarmerPaymentDetails'));

// Route configurations by role
const routeConfig = {
  ADMIN: [
    { 
      path: "admin", 
      children: [
        { path: "", element: <AdminPaymentDashboard /> },
        { path: ":paymentId", element: <AdminPaymentDetails /> }
      ]
    }
  ],
  BUYER: [
    { 
      path: "buyer", 
      children: [
        { path: "", element: <BuyerPaymentDashboard /> },
        { path: ":paymentId", element: <PaymentStatus showNavigation /> },
        { path: ":paymentId/process", element: <PaymentOptions /> },
        { path: ":paymentId/processing", element: <PaymentProcessing /> },
        { path: ":paymentId/status", element: <PaymentStatus /> }
      ]
    }
  ],
  FARMER: [
    { 
      path: "farmer", 
      children: [
        { path: "", element: <FarmerPaymentDashboard /> },
        { path: ":paymentId", element: <FarmerPaymentDetails /> }
      ]
    }
  ]
};

const PaymentRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderRoutes = (routes) => {
    return routes.map((route) => {
      if (route.children) {
        return (
          <Route key={route.path} path={route.path}>
            {route.children.map((childRoute) => (
              <Route
                key={`${route.path}-${childRoute.path}`}
                path={childRoute.path}
                element={
                  <Suspense fallback={<Loading />}>
                    {childRoute.element}
                  </Suspense>
                }
              />
            ))}
          </Route>
        );
      }

      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<Loading />}>
              {route.element}
            </Suspense>
          }
        />
      );
    });
  };

  return (
    <Routes>
      {/* Role-based route protection */}
      <Route element={<ProtectedRoute allowedRoles={[user.role]} />}>
        {/* Role-specific routes */}
        {renderRoutes(routeConfig[user.role])}
      </Route>

      {/* Default redirect based on user role */}
      <Route 
        path="" 
        element={<Navigate to={`${user.role.toLowerCase()}`} replace />} 
      />

      {/* Catch-all redirect */}
      <Route 
        path="*" 
        element={<Navigate to={`${user.role.toLowerCase()}`} replace />} 
      />
    </Routes>
  );
};

export default PaymentRoutes;