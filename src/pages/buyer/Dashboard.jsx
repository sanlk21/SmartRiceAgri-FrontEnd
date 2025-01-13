// src/pages/buyer/Dashboard.jsx
import { useAuth } from '../../context/AuthContext';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>
        <div className="mb-4">
          <p><strong>Welcome, {user?.fullName}</strong></p>
          <p>Company: {user?.companyName}</p>
          <p>Business Registration Number: {user?.businessRegNumber}</p>
          <p>Store Location: {user?.storeLocation}</p>
          <p>Email: {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BuyerDashboard;