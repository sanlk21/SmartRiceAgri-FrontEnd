// src/utils/websocketHandlers.js
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, BellRing, Check } from 'lucide-react';
import { store } from '../store'; // If you're using Redux or similar
import wsClient from './websocket';

// Notification helper functions
const showNotification = (title, description, variant = "default", icon = null) => {
  toast({
    title,
    description,
    variant,
    duration: 5000,
    icon: icon && (
      <span className={`mr-2 ${
        variant === "destructive" ? "text-red-500" : 
        variant === "success" ? "text-green-500" : 
        "text-blue-500"
      }`}>
        {icon}
      </span>
    ),
  });
};

const notificationHandlers = {
  bidPlaced: (data) => {
    showNotification(
      "Bid Placed Successfully",
      `Your bid of Rs.${data.amount} for ${data.variety} rice has been placed.`,
      "success",
      <Check className="h-5 w-5" />
    );
  },

  bidWon: (bidDetails) => {
    showNotification(
      "Congratulations! Bid Won",
      `You've won the bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} at Rs.${bidDetails.winningBidAmount}/kg`,
      "success",
      <Check className="h-5 w-5" />
    );
  },

  bidExpired: (bidDetails) => {
    showNotification(
      "Bid Expired",
      `Your bid for ${bidDetails.quantity}kg of ${bidDetails.riceVariety} has expired.`,
      "default",
      <BellRing className="h-5 w-5" />
    );
  },

  urgentWeatherAlert: (data) => {
    showNotification(
      "Urgent Weather Alert",
      data.message,
      "destructive",
      <AlertTriangle className="h-5 w-5" />
    );
  },

  weatherUpdate: (data) => {
    showNotification(
      "Weather Update",
      data.message,
      "default",
      <BellRing className="h-5 w-5" />
    );
  }
};

export const setupWebSocketHandlers = () => {
  // Handle bid updates
  wsClient.subscribe('bid_update', (data) => {
    switch (data.action) {
      case 'BID_PLACED':
        notificationHandlers.bidPlaced(data);
        // Update bid list or bid details if necessary
        if (store?.dispatch) {
          store.dispatch({
            type: 'bids/bidPlaced',
            payload: data
          });
        }
        break;
      
      case 'BID_WON':
        notificationHandlers.bidWon(data.bidDetails);
        if (store?.dispatch) {
          store.dispatch({
            type: 'bids/bidWon',
            payload: data.bidDetails
          });
        }
        break;
      
      case 'BID_EXPIRED':
        notificationHandlers.bidExpired(data.bidDetails);
        if (store?.dispatch) {
          store.dispatch({
            type: 'bids/bidExpired',
            payload: data.bidDetails
          });
        }
        break;
      
      default:
        console.log('Unknown bid update action:', data.action);
    }
  });

  // Handle fertilizer allocation updates
  wsClient.subscribe('fertilizer_update', (data) => {
    if (store?.dispatch) {
      store.dispatch({
        type: 'fertilizer/updateAllocation',
        payload: data
      });
    }
  });

  // Handle weather alerts
  wsClient.subscribe('weather_alert', (data) => {
    if (data.severity === 'HIGH') {
      notificationHandlers.urgentWeatherAlert(data);
    } else {
      notificationHandlers.weatherUpdate(data);
    }
  });

  // Handle connection status
  wsClient.subscribe('connection', (data) => {
    if (data.status === 'disconnected') {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      showNotification(
        "Connection Lost",
        "Attempting to reconnect...",
        "warning",
        <AlertTriangle className="h-5 w-5" />
      );
    } else if (data.status === 'failed') {
      console.error('WebSocket connection failed:', data.error);
      showNotification(
        "Connection Failed",
        "Unable to connect to the server",
        "destructive",
        <AlertTriangle className="h-5 w-5" />
      );
    }
  });
};

// Export functions for manual WebSocket operations
export const webSocketOperations = {
  sendBid: (bidData) => {
    wsClient.send('place_bid', bidData);
  },

  updateBidStatus: (bidId, status) => {
    wsClient.send('update_bid', { bidId, status });
  },

  sendMessage: (message) => {
    wsClient.send('chat_message', message);
  },

  reconnect: () => {
    wsClient.connect();
  },

  disconnect: () => {
    wsClient.disconnect();
  }
};

// Initialize WebSocket connection
export const initializeWebSocket = () => {
  wsClient.connect();
  setupWebSocketHandlers();
};