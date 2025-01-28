// src/routes/admin/index.jsx
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../../components/layouts';
import AdminDashboard from '../../pages/admin/Dashboard';
import UserDetails from '../../pages/admin/users/UserDetails';
import UserManagement from '../../pages/admin/users/UserManagement';
import AdminRoute from './AdminRoute';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:nic" element={<UserDetails />} />
              </Routes>
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;