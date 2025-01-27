// src/routes/index.jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/layouts/Layout';

// Import Route Groups
import AdminRoutes from './admin/AdminRoute';
import BuyerRoutes from './buyer';
import FarmerRoutes from './farmer';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        {/* Route groups */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/farmer/*" element={<FarmerRoutes />} />
        <Route path="/buyer/*" element={<BuyerRoutes />} />

        {/* Redirect root to appropriate dashboard based on role */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;