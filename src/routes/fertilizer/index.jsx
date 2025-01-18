// src/routes/fertilizer/index.jsx
import AdminFertilizerDashboard from '@/components/admin/fertilizer/AdminFertilizerDashboard';
import AllocationList from '@/components/admin/fertilizer/AllocationList';
import FarmerFertilizerDashboard from '@/components/farmer/fertilizer/FertilizerDashboard';
import QuotaDetails from '@/components/farmer/fertilizer/QuotaDetails';
import { useAuth } from '@/context/AuthContext';
import { Route, Routes } from 'react-router-dom';

const FertilizerRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Routes>
      {isAdmin ? (
        // Admin Routes
        <>
          <Route index element={<AdminFertilizerDashboard />} />
          <Route path="allocations" element={<AllocationList />} />
        </>
      ) : (
        // Farmer Routes
        <>
          <Route index element={<FarmerFertilizerDashboard />} />
          <Route path="quota" element={<QuotaDetails />} />
        </>
      )}
    </Routes>
  );
};

export default FertilizerRoutes;