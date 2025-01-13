import { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';

// Import authentication components
import Login from '@pages/auth/Login';
import Register from '@pages/auth/Register';

// Import protected route component
import ProtectedRoute from '@components/common/ProtectedRoute';

// Import dashboard pages
import AdminDashboard from '@pages/admin/Dashboard';
import BuyerDashboard from '@pages/buyer/Dashboard';
import FarmerDashboard from '@pages/farmer/Dashboard';

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

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['FARMER']} />}>
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
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