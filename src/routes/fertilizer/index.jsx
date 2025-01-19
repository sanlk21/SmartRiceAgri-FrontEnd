import AdminFertilizerDashboard from '@/components/admin/fertilizer/AdminFertilizerDashboard';
import AllocationList from '@/components/admin/fertilizer/AllocationList';
import FarmerFertilizerDashboard from '@/components/farmer/fertilizer/FertilizerDashboard';
import QuotaDetails from '@/components/farmer/fertilizer/QuotaDetails';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';

const FertilizerRoutes = () => {
  const { user } = useAuth();

  if (!user?.role) {
    return <div>Loading user information...</div>;
  }

  return (
    <Routes>
      {user.role === 'ADMIN' ? (
        // Admin Routes
        <>
          <Route index element={<AdminFertilizerDashboard />} />
          <Route path="allocations" element={<AllocationList />} />
        </>
      ) : user.role === 'FARMER' ? (
        // Farmer Routes
        <>
          <Route index element={<FarmerFertilizerDashboard />} />
          <Route path="quota" element={<QuotaDetails />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      )}
    </Routes>
  );
};

export default FertilizerRoutes;
