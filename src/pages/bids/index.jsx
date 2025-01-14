//import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AvailableBids, MyBids } from '../../components/buyer/bids';
import { BidDetails, BidList, CreateBid } from '../../components/farmer/bids';
import { BidProvider } from '../../contexts/BidContext';
import { useAuth } from '../../hooks/useAuth';
import BidHistory from './BidHistory';
import BidSearch from './BidSearch';
import FarmerBidStatistics from './FarmerBidStatistics';

const BidRoutes = () => {
  const { user } = useAuth();

  const isFarmer = user?.role === 'FARMER';
  const isBuyer = user?.role === 'BUYER';

  if (!user) return <Navigate to="/login" />;

  return (
    <BidProvider>
      <Routes>
        {/* Farmer Routes */}
        {isFarmer && (
          <>
            <Route path="/create" element={<CreateBid />} />
            <Route path="/my-bids" element={<BidList />} />
            <Route path="/statistics" element={<FarmerBidStatistics />} />
          </>
        )}

        {/* Buyer Routes */}
        {isBuyer && (
          <>
            <Route path="/available" element={<AvailableBids />} />
            <Route path="/my-bids" element={<MyBids />} />
            <Route path="/history" element={<BidHistory />} />
          </>
        )}

        {/* Common Routes */}
        <Route path="/:bidId" element={<BidDetails />} />
        <Route path="/search" element={<BidSearch />} />
        <Route
          path="/"
          element={<Navigate to={isFarmer ? '/bids/my-bids' : '/bids/available'} replace />}
        />
      </Routes>
    </BidProvider>
  );
};

export default BidRoutes;
