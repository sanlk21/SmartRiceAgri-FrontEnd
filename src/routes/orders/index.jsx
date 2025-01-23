// src/routes/orders/index.jsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Import components
import AdminOrderDetail from '../../components/admin/orders/AdminOrderDetail';
import AdminOrderManagement from '../../components/admin/orders/AdminOrderManagement';
import OrderDetails from '../../components/orders/OrderDetails';
import OrderHistory from '../../components/orders/OrderHistory';
import OrderManagement from '../../components/orders/OrderManagement';

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