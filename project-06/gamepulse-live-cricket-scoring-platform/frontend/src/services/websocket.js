import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.isConnected = false;
  }

  connect(onConnectedCallback, onErrorCallback) {
    const envWsUrl = (import.meta.env && import.meta.env.VITE_WS_BASE_URL) || '';
    const protocol = typeof window !== 'undefined' && window.location ? window.location.protocol : 'http:';
    const host = typeof window !== 'undefined' && window.location ? window.location.host : '';
    const defaultWsUrl = `${protocol}//${host}/ws-gamepulse`;
    const wsUrl = envWsUrl || defaultWsUrl;

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        // Connected to STOMP WebSocket
        if (onConnectedCallback) onConnectedCallback();
      },
      onStompError: (frame) => {
        this.isConnected = false;
        console.error('STOMP Error:', frame);
        if (onErrorCallback) onErrorCallback(frame);
      },
      onDisconnect: () => {
        this.isConnected = false;
      }
    });

    this.client.activate();
  }

  subscribe(destination, onMessageReceived) {
    const performSub = () => {
      if (this.subscriptions.has(destination)) {
        this.subscriptions.get(destination).unsubscribe();
      }

      const sub = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          onMessageReceived(data);
        } catch (err) {
          console.error('Error parsing STOMP message:', err);
        }
      });

      this.subscriptions.set(destination, sub);
      return sub;
    };

    if (this.client && this.client.connected) {
      return performSub();
    } else {
      // Connect first then subscribe
      this.connect(() => {
        performSub();
      });
    }
  }

  subscribeToMatch(matchId, onMessageReceived) {
    const topic = `/topic/match/${matchId}`;
    return this.subscribe(topic, onMessageReceived);
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;
