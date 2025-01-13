import { useAuth } from '@/context/AuthContext';
import {
    BarChart,
    Cloud,
    Home,
    Settings,
    ShoppingCart,
    Users,
    Warehouse
} from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();

  const getFarmerLinks = () => [
    { to: '/farmer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/farmer/weather', icon: Cloud, label: 'Weather' },
    { to: '/farmer/crops', icon: Warehouse, label: 'My Crops' },
    { to: '/farmer/bids', icon: ShoppingCart, label: 'Active Bids' },
    { to: '/farmer/analytics', icon: BarChart, label: 'Analytics' },
  ];

  const getBuyerLinks = () => [
    { to: '/buyer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/buyer/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { to: '/buyer/orders', icon: Warehouse, label: 'My Orders' },
    { to: '/buyer/analytics', icon: BarChart, label: 'Analytics' },
  ];

  const getAdminLinks = () => [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'FARMER':
        return getFarmerLinks();
      case 'BUYER':
        return getBuyerLinks();
      case 'ADMIN':
        return getAdminLinks();
      default:
        return [];
    }
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">
              Smart Agriculture
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {getLinks().map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <link.icon className="mr-3 h-6 w-6" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;