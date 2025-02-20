import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div
        className="min-h-screen bg-cover bg-center p-6"
        style={{ backgroundImage: "url('/images/Admin1.jpg')" }}
      >
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="space-y-4">
            <div className="bg-white/80 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Welcome, {user?.fullName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Role:</p>
                  <p className="font-medium">Administrator</p>
                </div>
                <div>
                  <p className="text-gray-600">NIC:</p>
                  <p className="font-medium">{user?.nic}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone:</p>
                  <p className="font-medium">{user?.phoneNumber}</p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;