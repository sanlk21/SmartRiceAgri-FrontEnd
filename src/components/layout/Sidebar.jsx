import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  ChevronDown,
  Cloud,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  Warehouse
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const getFarmerLinks = () => [
    { to: '/farmer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/farmer/weather', icon: Cloud, label: 'Weather' },
    { to: '/farmer/lands', icon: MapPin, label: 'Land Management' },
    {
      key: 'fertilizer',
      icon: Package,
      label: 'Fertilizer Quota',
      children: [
        { to: '/farmer/fertilizer', label: 'Overview' },
        { to: '/farmer/fertilizer/quota', label: 'Quota Details' }
      ]
    },
    { to: '/farmer/bids', icon: ShoppingCart, label: 'Active Bids' },
    { to: '/farmer/orders', icon: FileText, label: 'Orders' },
    { to: '/farmer/payments', icon: CreditCard, label: 'Payments' },
    { to: '/farmer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/farmer/support', icon: HelpCircle, label: 'Support' }
  ];

  const getAdminLinks = () => [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/lands', icon: MapPin, label: 'Land Administration' },
    {
      key: 'fertilizer',
      icon: Package,
      label: 'Fertilizer Management',
      children: [
        { to: '/admin/fertilizer', label: 'Dashboard' },
        { to: '/admin/fertilizer/allocations', label: 'Allocations' }
      ]
    },
    { to: '/admin/orders', icon: FileText, label: 'Orders' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/support', icon: HelpCircle, label: 'Support Tickets' },
    { to: '/admin/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const getBuyerLinks = () => [
    { to: '/buyer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/buyer/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { to: '/buyer/orders', icon: Warehouse, label: 'My Orders' },
    { to: '/buyer/payments', icon: Wallet, label: 'Payments' },
    { to: '/buyer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/buyer/support', icon: HelpCircle, label: 'Support' }
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

  const renderNavItem = (link) => {
    if (link.children) {
      return (
        <div key={link.key} className="space-y-1">
          <button
            onClick={() => toggleMenu(link.key)}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
          >
            <link.icon className="mr-3 h-6 w-6" />
            <span className="flex-1 text-left">{link.label}</span>
            <ChevronDown 
              className={`h-4 w-4 transform transition-transform ${
                expandedMenus[link.key] ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedMenus[link.key] && (
            <div className="pl-11 space-y-1">
              {link.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) =>
                    `block px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
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
    );
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
              {getLinks().map(renderNavItem)}
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