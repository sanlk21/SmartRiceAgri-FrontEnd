import Loading from '@/components/common/Loading';
import { useAuth } from '@/context/AuthContext';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const NotificationList = lazy(() => import('./NotificationList'));
const AdminBroadcast = lazy(() => import('./AdminBroadcast'));
const NotificationSettings = lazy(() => import('./NotificationSettings'));
const NotificationManagement = lazy(() => import('./NotificationManagement'));
const NotificationReports = lazy(() => import('./NotificationReports'));

const NotificationRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route index element={<NotificationList />} />

        {user?.role === 'ADMIN' && (
          <>
            <Route path="broadcast" element={<AdminBroadcast />} />
            <Route path="broadcast/:id" element={<AdminBroadcast />} />
          </>
        )}

        <Route path="settings" element={<NotificationSettings />} />

        {user?.role === 'ADMIN' && (
          <>
            <Route path="manage" element={<NotificationManagement />} />
            <Route path="reports" element={<NotificationReports />} />
          </>
        )}

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

export default NotificationRoutes;