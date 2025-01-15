// src/services/websocketService.js

class WebSocketService {
    constructor() {
      this.ws = null;
      this.subscribers = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = 3000; // 3 seconds
    }
  
    connect() {
      try {
        const token = localStorage.getItem('token');
        const wsUrl = `${import.meta.env.VITE_WS_URL}/ws?token=${token}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = this.handleOpen.bind(this);
        this.ws.onmessage = this.handleMessage.bind(this);
        this.ws.onclose = this.handleClose.bind(this);
        this.ws.onerror = this.handleError.bind(this);
  
        return true;
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        return false;
      }
    }
  
    handleOpen() {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.subscribeToBidUpdates();
    }
  
    handleMessage(event) {
      try {
        const data = JSON.parse(event.data);
        
        // Handle different types of messages
        switch (data.type) {
          case 'BID_UPDATE':
            this.notifySubscribers('bidUpdates', data.payload);
            break;
          case 'NEW_BID':
            this.notifySubscribers('newBids', data.payload);
            break;
          case 'BID_EXPIRED':
            this.notifySubscribers('bidExpired', data.payload);
            break;
          case 'BID_WON':
            this.notifySubscribers('bidWon', data.payload);
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    }
  
    handleClose(event) {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.attemptReconnect();
    }
  
    handleError(error) {
      console.error('WebSocket error:', error);
    }
  
    attemptReconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
      }
  
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  
    subscribeToBidUpdates() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'SUBSCRIBE',
          channel: 'bid_updates'
        }));
      }
    }
  
    subscribe(event, callback) {
      if (!this.subscribers.has(event)) {
        this.subscribers.set(event, new Set());
      }
      this.subscribers.get(event).add(callback);
  
      // Return unsubscribe function
      return () => {
        const callbacks = this.subscribers.get(event);
        if (callbacks) {
          callbacks.delete(callback);
        }
      };
    }
  
    notifySubscribers(event, data) {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.forEach(callback => callback(data));
      }
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  
    // Send bid-related messages
    sendBid(bidData) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'PLACE_BID',
          payload: bidData
        }));
      }
    }
  
    updateBid(bidId, updateData) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'UPDATE_BID',
          payload: { bidId, ...updateData }
        }));
      }
    }
  }
  
  // Create singleton instance
  const websocketService = new WebSocketService();
  export default websocketService;