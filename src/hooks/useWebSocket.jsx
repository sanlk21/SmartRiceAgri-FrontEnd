// src/hooks/useWebSocket.js
import { useAuth } from '@/context/AuthContext';
import { useBidNotifications } from '@/hooks/useBidNotifications';
import websocketService from '@/services/websocketService';
import { useCallback, useEffect } from 'react';

export const useWebSocket = () => {
  const { user } = useAuth();
  const { showBidPlaced, showBidWon, showBidExpired } = useBidNotifications();

  const handleBidUpdate = useCallback((data) => {
    switch (data.type) {
      case 'BID_PLACED':
        showBidPlaced(data);
        break;
      case 'BID_WON':
        showBidWon(data);
        break;
      case 'BID_EXPIRED':
        showBidExpired();
        break;
      default:
        break;
    }
  }, [showBidPlaced, showBidWon, showBidExpired]);

  useEffect(() => {
    if (user) {
      // Connect to WebSocket when component mounts
      websocketService.connect();

      // Subscribe to bid updates
      const unsubscribe = websocketService.subscribe('bidUpdates', handleBidUpdate);

      // Cleanup on unmount
      return () => {
        unsubscribe();
        websocketService.disconnect();
      };
    }
  }, [user, handleBidUpdate]);

  return {
    sendBid: websocketService.sendBid.bind(websocketService),
    updateBid: websocketService.updateBid.bind(websocketService),
  };
};