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

// Import Land Management Pages
import LandAdministration from '@pages/admin/LandAdministration';
import LandManagement from '@pages/farmer/LandManagement';

// Import Fertilizer Routes
import FertilizerRoutes from '@/routes/fertilizer';

// Import Order and Payment Routes
import OrderRoutes from '@pages/orders';
import PaymentRoutes from '@pages/payments';

// Import Support Pages
import { AdminSupportPage, UserSupportPage } from '@pages/support';

// Import context providers
import { AuthProvider } from '@context/AuthContext';
import { FertilizerProvider } from '@context/FertilizerContext';
import { OrderProvider } from '@context/OrderContext';
import { PaymentProvider } from '@context/PaymentContext';

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
        <OrderProvider>
          <PaymentProvider>
            <FertilizerProvider>
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
                      <Route path="/farmer/lands" element={<LandManagement />} />
                      <Route path="/farmer/fertilizer/*" element={<FertilizerRoutes />} />
                      <Route path="/farmer/orders/*" element={<OrderRoutes />} />
                      <Route path="/farmer/payments/*" element={<PaymentRoutes />} />
                      <Route path="/farmer/support" element={<UserSupportPage />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route element={<Layout />}>
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/lands" element={<LandAdministration />} />
                      <Route path="/admin/fertilizer/*" element={<FertilizerRoutes />} />
                      <Route path="/admin/orders/*" element={<OrderRoutes />} />
                      <Route path="/admin/payments/*" element={<PaymentRoutes />} />
                      <Route path="/admin/support" element={<AdminSupportPage />} />
                    </Route>
                  </Route>

                  {/* Buyer Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
                    <Route element={<Layout />}>
                      <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                      <Route path="/buyer/orders/*" element={<OrderRoutes />} />
                      <Route path="/buyer/payments/*" element={<PaymentRoutes />} />
                      <Route path="/buyer/support" element={<UserSupportPage />} />
                    </Route>
                  </Route>

                  {/* Redirect */}
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  {/* 404 Not Found */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </FertilizerProvider>
          </PaymentProvider>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;