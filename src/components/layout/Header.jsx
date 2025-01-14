import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.role === 'FARMER' && 'Farmer Dashboard'}
              {user?.role === 'BUYER' && 'Buyer Dashboard'}
              {user?.role === 'ADMIN' && 'Admin Dashboard'}
            </h2>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <div className="relative flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;