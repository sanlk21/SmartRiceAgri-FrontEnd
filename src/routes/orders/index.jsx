// src/routes/orders/index.jsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Fix import paths with correct casing
import OrderDetails from '../../components/Orders/OrderDetails';
import OrderHistory from '../../components/Orders/OrderHistory';
import OrderManagement from '../../components/Orders/OrderManagement';
import AdminOrderDetail from '../../components/admin/Orders/AdminOrderDetail';
import AdminOrderManagement from '../../components/admin/Orders/AdminOrderManagement';

const OrderRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="admin" element={<AdminOrderManagement />} />
        <Route path="admin/:orderId" element={<AdminOrderDetail />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['BUYER', 'FARMER']} />}>
        <Route index element={<OrderManagement />} />
        <Route path="history" element={<OrderHistory />} />
        <Route path=":orderId" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
};

export default OrderRoutes;