// src/routes/fertilizer/index.jsx
import { FertilizerProvider } from '@/context/FertilizerContext';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Route, Routes } from 'react-router-dom';

// Admin Components
import AdminFertilizerDashboard from '@/components/admin/fertilizer/AdminFertilizerDashboard';
import AdminAllocationList from '@/components/admin/fertilizer/AllocationList';

// Farmer Components
import FarmerFertilizerDashboard from '@/components/farmer/fertilizer/FertilizerDashboard';
import QuotaDetails from '@/components/farmer/fertilizer/QuotaDetails';

const FertilizerRoutes = () => {
  const { user } = useAuth();

  if (!user?.role) {
    return <div>Loading user information...</div>;
  }

  return (
    <FertilizerProvider>
      <Routes>
        {user.role === 'ADMIN' ? (
          <>
            <Route index element={<AdminFertilizerDashboard />} />
            <Route path="allocations" element={<AdminAllocationList />} />
          </>
        ) : user.role === 'FARMER' ? (
          <>
            <Route index element={<FarmerFertilizerDashboard />} />
            <Route path="quota" element={<QuotaDetails />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        )}
      </Routes>
    </FertilizerProvider>
  );
};

export default FertilizerRoutes;