// src/routes/bids/index.jsx
import AdminActiveBids from '@/components/admin/bids/AdminActiveBids';
import AdminBidAnalytics from '@/components/admin/bids/AdminBidAnalytics';
import AdminBidDashboard from '@/components/admin/bids/AdminBidDashboard';
import AdminBidReports from '@/components/admin/bids/AdminBidReports';
import AdminCompletedBids from '@/components/admin/bids/AdminCompletedBids';
import AvailableBids from '@/components/buyer/bids/AvailableBids';
import MyBids from '@/components/buyer/bids/MyBids';
import BidHistory from '@/components/buyer/bids/MyBidsHistory';
import BidDetails from '@/components/farmer/bids/BidDetails';
import BidList from '@/components/farmer/bids/BidList';
import CreateBid from '@/components/farmer/bids/CreateBid';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const BidRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isFarmer = user.role === 'FARMER';
  const isBuyer = user.role === 'BUYER';
  const isAdmin = user.role === 'ADMIN';

  return (
    <Routes>
      {/* Farmer Routes */}
      {isFarmer && (
        <>
          <Route path="create" element={<CreateBid />} />
          <Route path="my-bids" element={<BidList />} />
          <Route path=":bidId" element={<BidDetails />} />
        </>
      )}

      {/* Buyer Routes */}
      {isBuyer && (
        <>
          <Route path="available" element={<AvailableBids />} />
          <Route path="my-bids" element={<MyBids />} />
          <Route path="history" element={<BidHistory />} />
          <Route path=":bidId" element={<BidDetails />} />
        </>
      )}

      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="dashboard" element={<AdminBidDashboard />} />
          <Route path="active" element={<AdminActiveBids />} />
          <Route path="completed" element={<AdminCompletedBids />} />
          <Route path="analytics" element={<AdminBidAnalytics />} />
          <Route path="reports" element={<AdminBidReports />} />
          <Route path=":bidId" element={<BidDetails />} />
        </>
      )}

      {/* Default Route */}
      <Route
        path="/"
        element={
          <Navigate 
            to={
              isAdmin ? "dashboard" : 
              isFarmer ? "my-bids" : 
              "available"
            } 
            replace 
          />
        }
      />
    </Routes>
  );
};

export default BidRoutes;