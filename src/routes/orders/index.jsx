// src/routes/orders/index.jsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Components imports with correct casing
import OrderDetails from '../../components/Orders/OrderDetails';
import OrderHistory from '../../components/Orders/OrderHistory';
import OrderManagement from '../../components/Orders/OrderManagement';
import AdminOrderDetails from '../../components/admin/Orders/AdminOrderDetails';
import AdminOrderManagement from '../../components/admin/Orders/AdminOrderManagement';

const OrderRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Separate admin and user routes based on role
  if (user.role === 'ADMIN') {
    return (
      <Routes>
        <Route index element={<AdminOrderManagement />} />
        <Route path=":orderId" element={<AdminOrderDetails />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER']} />}>
        <Route index element={<OrderManagement />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path=":orderId" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
};

export default OrderRoutes;