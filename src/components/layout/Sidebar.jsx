// src/components/layouts/Sidebar.jsx
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  ChevronDown,
  Cloud,
  CreditCard,
  FileText,
  Gavel,
  HelpCircle,
  Home,
  LineChart,
  LogOut,
  MapPin,
  Package,
  Settings,
  Users,
  Wallet,
  Warehouse,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close the expanded menu when route changes on mobile
    if (onClose && location) {
      onClose();
    }
  }, [location, onClose]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Your existing link definitions...
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
        { to: '/farmer/fertilizer/quota', label: 'Quota Details' },
      ],
    },
    {
      key: 'bids',
      icon: Gavel,
      label: 'Bids',
      children: [
        { to: '/farmer/bids/create', label: 'Create Bid' },
        { to: '/farmer/bids/list', label: 'Bid List' },
        { to: '/farmer/bids/details', label: 'Bid Details' },
      ],
    },
    { to: '/farmer/orders', icon: FileText, label: 'Orders' },
    { to: '/farmer/payments', icon: CreditCard, label: 'Payments' },
    { to: '/farmer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/farmer/support', icon: HelpCircle, label: 'Support' },
  ];

  const getBuyerLinks = () => [
    { to: '/buyer/dashboard', icon: Home, label: 'Dashboard' },
    {
      key: 'bids',
      icon: Gavel,
      label: 'Bids',
      children: [
        { to: '/buyer/bids/available', label: 'Available Bids' },
        { to: '/buyer/bids/my-bids', label: 'My Bids' },
        { to: '/buyer/bids/history', label: 'Bid History' }
      ]
    },
    { to: '/buyer/orders', icon: Warehouse, label: 'My Orders' },
    { to: '/buyer/payments', icon: Wallet, label: 'Payments' },
    { to: '/buyer/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/buyer/support', icon: HelpCircle, label: 'Support' }
  ];

  const getAdminLinks = () => [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/lands', icon: MapPin, label: 'Land Administration' },
    {
      key: 'bids',
      icon: Gavel,
      label: 'Bid Management',
      children: [
        { to: '/admin/bids', label: 'Dashboard' },
        { to: '/admin/bids/active', label: 'Active Bids' },
        { to: '/admin/bids/completed', label: 'Completed Bids' },
        { to: '/admin/bids/analytics', label: 'Analytics' },
        { to: '/admin/bids/reports', label: 'Reports' }
      ]
    },
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
    { to: '/admin/analytics', icon: LineChart, label: 'Analytics' },
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

  const renderNavItem = (link) => {
    if (link.children) {
      return (
        <div key={link.key} className="space-y-1">
          <button
            onClick={() => toggleMenu(link.key)}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-lime-300 hover:bg-lime-700 hover:text-white rounded-md"
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
                  onClick={onClose}
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
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-lime-900 text-white'
              : 'text-gray-300 hover:bg-lime-700 hover:text-white'
          }`
        }
      >
        <link.icon className="mr-3 h-6 w-6" />
        {link.label}
      </NavLink>
    );
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-64 bg-gray-800">
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gray-900">
      <h1 className="text-xl font-bold italic text-green-500">
          Smart Agriculture
        </h1>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden text-white hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {getLinks().map(renderNavItem)}
        </nav>

        <div className="flex-shrink-0 bg-gray-900 p-4">
          <div className="flex flex-col space-y-3">
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
            <button
              onClick={handleLogout}
              className="flex items-center px-2 py-2 text-sm font-medium text-red-300 hover:bg-red-600 hover:text-white rounded-md w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;