import Dashboard from '@/pages/farmer/Dashboard';
import LandManagement from '@/pages/farmer/LandManagement';
import Weather from '@/pages/farmer/Weather';
import { Route, Routes } from 'react-router-dom';

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Dashboard />} />
      <Route path="weather" element={<Weather />} />
      <Route path="land" element={<LandManagement />} />
    </Routes>
  );
};

export default FarmerRoutes;