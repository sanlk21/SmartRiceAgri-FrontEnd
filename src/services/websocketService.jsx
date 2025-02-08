// src/services/websocketService.js
class WebSocketService {
  constructor() {
      this.ws = null;
      this.subscribers = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = 3000;
      this.isConnecting = false;
  }

  async connect() {
      if (this.isConnecting) return;
      this.isConnecting = true;

      try {
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('No authentication token found');
          }

          const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/notifications?token=${token}`;
          
          this.ws = new WebSocket(wsUrl);
          
          this.ws.onopen = this.handleOpen.bind(this);
          this.ws.onmessage = this.handleMessage.bind(this);
          this.ws.onclose = this.handleClose.bind(this);
          this.ws.onerror = this.handleError.bind(this);

          // Set a connection timeout
          setTimeout(() => {
              if (this.ws.readyState !== WebSocket.OPEN) {
                  this.ws.close();
              }
          }, 10000);

          return new Promise((resolve, reject) => {
              this.ws.onopen = () => {
                  this.isConnecting = false;
                  this.reconnectAttempts = 0;
                  resolve();
              };
              this.ws.onerror = (error) => {
                  this.isConnecting = false;
                  reject(error);
              };
          });
      } catch (error) {
          this.isConnecting = false;
          console.error('WebSocket connection failed:', error);
          throw error;
      }
  }

  handleOpen() {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      this.subscribeToBidUpdates();
      this.subscribeToBroadcasts();
  }

  handleMessage(event) {
      try {
          const data = JSON.parse(event.data);
          this.notifySubscribers(data.type, data.payload);
      } catch (error) {
          console.error('Error handling WebSocket message:', error);
      }
  }

  handleClose(event) {
      if (event.code !== 1000) {
          this.attemptReconnect();
      }
  }

  handleError(error) {
      console.error('WebSocket error:', error);
      this.ws?.close();
  }

  attemptReconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
          this.notifySubscribers('error', { message: 'Connection lost' });
          return;
      }

      this.reconnectAttempts++;
      const delay = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);

      setTimeout(() => {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          this.connect().catch(() => {
              if (this.reconnectAttempts < this.maxReconnectAttempts) {
                  this.attemptReconnect();
              }
          });
      }, delay);
  }

  subscribe(event, callback) {
      if (!this.subscribers.has(event)) {
          this.subscribers.set(event, new Set());
      }
      this.subscribers.get(event).add(callback);
      return () => this.subscribers.get(event)?.delete(callback);
  }

  subscribeToBidUpdates() {
      if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
              type: 'SUBSCRIBE',
              channel: 'bid_updates'
          }));
      }
  }

  subscribeToBroadcasts() {
      if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
              type: 'SUBSCRIBE',
              channel: 'broadcasts'
          }));
      }
  }

  notifySubscribers(event, data) {
      const callbacks = this.subscribers.get(event);
      callbacks?.forEach(callback => {
          try {
              callback(data);
          } catch (error) {
              console.error('Error in subscriber callback:', error);
          }
      });
  }

  disconnect() {
      if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.close(1000, 'Client disconnecting');
      }
      this.ws = null;
      this.subscribers.clear();
  }
}

const websocketService = new WebSocketService();
export default websocketService;