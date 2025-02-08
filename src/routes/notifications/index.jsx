// src/routes/notifications/index.jsx
import { useAuth } from '@/context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import AdminBroadcast from './AdminBroadcast';
import NotificationList from './NotificationList';
import NotificationSettings from './NotificationSettings';

const NotificationRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route index element={<NotificationList />} />
      {user?.role === 'ADMIN' && (
        <Route path="broadcast" element={<AdminBroadcast />} />
      )}
      <Route path="settings" element={<NotificationSettings />} />
    </Routes>
  );
};

export default NotificationRoutes;