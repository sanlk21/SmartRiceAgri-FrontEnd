// src/routes/notifications/index.jsx
import Loading from '@/components/common/Loading';
import { useAuth } from '@/context/AuthContext';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy load components for better performance
const NotificationList = lazy(() => import('./NotificationList'));
const AdminBroadcast = lazy(() => import('./AdminBroadcast'));
const NotificationSettings = lazy(() => import('./NotificationSettings'));

const NotificationRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main notification list - accessible to all users */}
        <Route index element={<NotificationList />} />

        {/* Admin-only routes */}
        {user?.role === 'ADMIN' && (
          <>
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="broadcast/:id" element={<AdminBroadcast />} />
          </>
        )}

        {/* Settings route - accessible to all users */}
        <Route path="settings" element={<NotificationSettings />} />

        {/* Additional routes based on user role */}
        {user?.role === 'ADMIN' && (
          <>
            <Route path="manage" element={<NotificationManagement />} />
            <Route path="reports" element={<NotificationReports />} />
          </>
        )}

        {/* Handle 404 within notifications section */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                <p className="text-gray-600">
                  The notification page you're looking for doesn't exist.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

// Component for notification management (Admin only)
const NotificationManagement = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Notification Management</h2>
      {/* Add your notification management content here */}
    </div>
  );
};

// Component for notification reports (Admin only)
const NotificationReports = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Notification Reports</h2>
      {/* Add your notification reports content here */}
    </div>
  );
};

export default NotificationRoutes;