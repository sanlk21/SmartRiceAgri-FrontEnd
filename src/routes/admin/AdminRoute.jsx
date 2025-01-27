// src/routes/admin/AdminRoute.jsx
import { Route, Routes } from 'react-router-dom';

// Admin Pages
import Dashboard from '../../pages/admin/Dashboard';
import LandAdministration from '../../pages/admin/LandAdministration';
import Support from '../../pages/admin/support';
import UserDetails from '../../pages/admin/users/UserDetails';
import UserManagement from '../../pages/admin/users/UserManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="users/:nic" element={<UserDetails />} />
      <Route path="lands" element={<LandAdministration />} />
      <Route path="support" element={<Support />} />
      
      {/* Add more admin routes as needed */}
      <Route path="bids/*" element={<BidRoutes />} />
      <Route path="fertilizer/*" element={<FertilizerRoutes />} />
      <Route path="orders/*" element={<OrderRoutes />} />
      <Route path="payments/*" element={<PaymentRoutes />} />
    </Routes>
  );
};

export default AdminRoutes;