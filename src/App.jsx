import PropTypes from 'prop-types';
import { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';

// Layout and Common Components
import Loading from './components/common/Loading';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { Toaster } from './components/ui/toaster';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import UserManagement from './components/admin/users/UserManagement';
import AdminDashboard from './pages/admin/Dashboard';
import LandAdministration from './pages/admin/LandAdministration';
import UserDetails from './pages/admin/users/UserDetails';

// Dashboard Pages
import BuyerDashboard from './pages/buyer/Dashboard';
import FarmerDashboard from './pages/farmer/Dashboard';

// Feature Pages
import LandManagement from './pages/farmer/LandManagement';
import Weather from './pages/farmer/Weather';

// Support Pages
import AdminSupportDashboard from './pages/support/AdminSupportPage';
import UserSupportPage from './pages/support/UserSupportPage';

// Route Configurations
import PaymentRoutes from './pages/payments';
import BidRoutes from './routes/bids';
import FertilizerRoutes from './routes/fertilizer';
import OrderRoutes from './routes/orders';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { BidProvider } from './context/BidContext';
import { FertilizerProvider } from './context/FertilizerContext';
import { OrderProvider } from './context/OrderContext';
import { PaymentProvider } from './context/PaymentContext';
import { SupportProvider } from './context/SupportContext';
import { UserProvider } from './context/UserContext';

// Error Boundary Component
const ErrorBoundaryWrapper = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

ErrorBoundaryWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// App Providers Component
const AppProviders = ({ children }) => (
  <ErrorBoundaryWrapper>
    <AuthProvider>
      <UserProvider>
        <OrderProvider>
          <PaymentProvider>
            <FertilizerProvider>
              <SupportProvider>
                <BidProvider>
                  {children}
                </BidProvider>
              </SupportProvider>
            </FertilizerProvider>
          </PaymentProvider>
        </OrderProvider>
      </UserProvider>
    </AuthProvider>
  </ErrorBoundaryWrapper>
);

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

AppProviders.displayName = 'AppProviders';

// Route Configuration
const routeConfig = {
  farmer: [
    { path: "dashboard", element: <FarmerDashboard /> },
    { path: "weather", element: <Weather /> },
    { path: "lands", element: <LandManagement /> },
    { path: "fertilizer/*", element: <FertilizerRoutes /> },
    { path: "bids/*", element: <BidRoutes /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support/*", element: <UserSupportPage /> }
  ],
  admin: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "users", element: <UserManagement /> },
    { path: "users/:nic", element: <UserDetails /> },
    { path: "lands", element: <LandAdministration /> },
    { path: "bids/*", element: <BidRoutes /> },
    { path: "fertilizer/*", element: <FertilizerRoutes /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support/*", element: <AdminSupportDashboard /> }
  ],
  buyer: [
    { path: "dashboard", element: <BuyerDashboard /> },
    { path: "bids/*", element: <BidRoutes /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support/*", element: <UserSupportPage /> }
  ]
};

// Generate Role-based Routes
const generateRoleRoutes = (role) => (
  <Route key={role} element={<ProtectedRoute allowedRoles={[role.toUpperCase()]} />}>
    <Route element={<Layout />}>
      {routeConfig[role].map(({ path, element }) => (
        <Route 
          key={path} 
          path={`/${role}/${path}`} 
          element={
            <ErrorBoundaryWrapper>
              <Suspense fallback={<Loading />}>
                {element}
              </Suspense>
            </ErrorBoundaryWrapper>
          } 
        />
      ))}
    </Route>
  </Route>
);

// Main App Component
function App() {
  return (
    <Router>
      <AppProviders>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Role-based Routes */}
            {generateRoleRoutes('farmer')}
            {generateRoleRoutes('admin')}
            {generateRoleRoutes('buyer')}

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AppProviders>
    </Router>
  );
}

export default App;