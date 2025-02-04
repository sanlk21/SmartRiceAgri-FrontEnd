// src/routes/orders/index.jsx
import ProtectedRoute from '@/components/common/ProtectedRoute';
import OrderDetails from '@/components/Orders/OrderDetails';
import OrderManagement from '@/components/Orders/OrderManagement';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const OrderRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'BUYER', 'FARMER']} />}>
        <Route index element={<OrderManagement />} />
        <Route path=":orderId" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
}

export default OrderRoutes;