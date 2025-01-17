import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  Cloud,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin // Added for land management
  ,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  Warehouse
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();

  const getFarmerLinks = () => [
    { to: '/farmer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/farmer/weather', icon: Cloud, label: 'Weather' },
    { to: '/farmer/lands', icon: MapPin, label: 'Land Management' }, // Added Land Management
    { to: '/farmer/fertilizer', icon: Package, label: 'Fertilizer Quota' },
    { to: '/farmer/bids', icon: ShoppingCart, label: 'Active Bids' },
    { to: '/farmer/orders', icon: FileText, label: 'Orders' },
    { to: '/farmer/payments', icon: CreditCard, label: 'Payments' },
    { to: '/farmer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/farmer/support', icon: HelpCircle, label: 'Support' }
  ];

  const getBuyerLinks = () => [
    { to: '/buyer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/buyer/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { to: '/buyer/orders', icon: Warehouse, label: 'My Orders' },
    { to: '/buyer/payments', icon: Wallet, label: 'Payments' },
    { to: '/buyer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/buyer/support', icon: HelpCircle, label: 'Support' }
  ];

  const getAdminLinks = () => [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/lands', icon: MapPin, label: 'Land Administration' }, // Added Land Administration
    { to: '/admin/fertilizer', icon: Package, label: 'Fertilizer Management' },
    { to: '/admin/orders', icon: FileText, label: 'Orders' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Tickets' },
    { to: '/admin/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
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

            {/* User Info */}
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-300">
                    {user?.role?.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;