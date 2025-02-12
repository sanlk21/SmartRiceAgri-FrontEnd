import { useAuth } from '../../context/AuthContext';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      
      {/* Main Content */}
      <div 
        className="min-h-screen bg-cover bg-center p-6" 
        style={{ backgroundImage: "url('/images/farmer1.jpg')" }}
      >
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>
          <div className="mb-4">
            <p className="font-semibold text-lg">Welcome, {user?.fullName}</p>
            <p className="text-gray-700">NIC: {user?.nic}</p>
            <p className="text-gray-700">Email: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;