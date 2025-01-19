import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Allow all access since authentication is removed
  return <Outlet />;
};

export default ProtectedRoute;
