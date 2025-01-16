// src/utils/websocket.jsx
class WebSocketClient {
    constructor(url) {
      this.url = url;
      this.ws = null;
      this.handlers = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectTimeout = 3000;
    }
  
    connect() {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          // Notify all connection handlers
          this.notify('connection', { status: 'connected' });
        };
  
        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.notify('connection', { status: 'disconnected' });
          this.attemptReconnect();
        };
  
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notify('error', { error });
        };
  
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notify(data.type, data.payload);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        this.attemptReconnect();
      }
    }
  
    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(), this.reconnectTimeout);
      } else {
        console.error('Max reconnection attempts reached');
        this.notify('connection', { 
          status: 'failed', 
          error: 'Max reconnection attempts reached' 
        });
      }
    }
  
    subscribe(event, handler) {
      if (!this.handlers.has(event)) {
        this.handlers.set(event, new Set());
      }
      this.handlers.get(event).add(handler);
  
      // Return unsubscribe function
      return () => {
        const handlers = this.handlers.get(event);
        if (handlers) {
          handlers.delete(handler);
        }
      };
    }
  
    notify(event, data) {
      const handlers = this.handlers.get(event);
      if (handlers) {
        handlers.forEach(handler => handler(data));
      }
    }
  
    send(type, payload) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type, payload }));
      } else {
        console.error('WebSocket is not connected');
        throw new Error('WebSocket is not connected');
      }
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }
  
  // Create singleton instance
  const wsClient = new WebSocketClient(
    import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
  );
  
  export default wsClient;