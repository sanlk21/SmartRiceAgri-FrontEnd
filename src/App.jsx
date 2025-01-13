import { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';

// Import authentication components
import Layout from '@components/layout/Layout';
import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';

// Import protected route component
import ProtectedRoute from '@components/common/ProtectedRoute';

// Import dashboard pages
import AdminDashboard from '@pages/admin/Dashboard';
import BuyerDashboard from '@pages/buyer/Dashboard';
import FarmerDashboard from '@pages/farmer/Dashboard';
import Weather from '@pages/farmer/Weather';

// Import context providers
import { AuthProvider } from '@context/AuthContext';

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Farmer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
              <Route element={<Layout />}>
                <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                <Route path="/farmer/weather" element={<Weather />} />
                {/* Add other farmer routes */}
              </Route>
            </Route>

            {/* Buyer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
              <Route element={<Layout />}>
                <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                {/* Add other buyer routes */}
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<Layout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                {/* Add other admin routes */}
              </Route>
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;