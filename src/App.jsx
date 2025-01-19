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

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import AdminDashboard from './pages/admin/Dashboard';
import BuyerDashboard from './pages/buyer/Dashboard';
import FarmerDashboard from './pages/farmer/Dashboard';

// Feature Pages
import LandAdministration from './pages/admin/LandAdministration';
import LandManagement from './pages/farmer/LandManagement';
import Weather from './pages/farmer/Weather';
import { AdminSupportPage, UserSupportPage } from './pages/support';

// Route Configurations
import PaymentRoutes from './pages/payments';
import FertilizerRoutes from './routes/fertilizer';
import OrderRoutes from './routes/orders';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { FertilizerProvider } from './context/FertilizerContext';
import { OrderProvider } from './context/OrderContext';
import { PaymentProvider } from './context/PaymentContext';

// App Providers wrapper component
const AppProviders = ({ children }) => (
  <AuthProvider>
    <OrderProvider>
      <PaymentProvider>
        <FertilizerProvider>
          {children}
        </FertilizerProvider>
      </PaymentProvider>
    </OrderProvider>
  </AuthProvider>
);

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

AppProviders.displayName = 'AppProviders';

// Route configurations
const routeConfig = {
  farmer: [
    { path: "dashboard", element: <FarmerDashboard /> },
    { path: "weather", element: <Weather /> },
    { path: "lands", element: <LandManagement /> },
    { path: "fertilizer/*", element: <FertilizerRoutes /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support", element: <UserSupportPage /> }
  ],
  admin: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "lands", element: <LandAdministration /> },
    { path: "fertilizer/*", element: <FertilizerRoutes /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support", element: <AdminSupportPage /> }
  ],
  buyer: [
    { path: "dashboard", element: <BuyerDashboard /> },
    { path: "orders/*", element: <OrderRoutes /> },
    { path: "payments/*", element: <PaymentRoutes /> },
    { path: "support", element: <UserSupportPage /> }
  ]
};

// Role-based route generator
const generateRoleRoutes = (role) => (
  <Route key={role} element={<ProtectedRoute allowedRoles={[role.toUpperCase()]} />}>
    <Route element={<Layout />}>
      {routeConfig[role].map(({ path, element }) => (
        <Route key={path} path={`/${role}/${path}`} element={element} />
      ))}
    </Route>
  </Route>
);

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
      </AppProviders>
    </Router>
  );
}

export default App;