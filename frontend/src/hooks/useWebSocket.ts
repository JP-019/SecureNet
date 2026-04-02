import { useEffect, useRef, useCallback, useState } from 'react';
import { getToken } from '../utils/helpers';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
}

type MessageHandler = (message: WebSocketMessage) => void;

const WS_URL = 'ws://localhost:3001';

export const useWebSocket = (onMessage: MessageHandler) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const token = getToken();
    const wsUrl = token ? `${WS_URL}?token=${token}` : WS_URL;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          onMessage(message);
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected, reconnecting...');
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [onMessage]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const sendChatMessage = useCallback((destinatarioId: string, contenido: string) => {
    return sendMessage({
      type: 'send_message',
      payload: { destinatarioId, contenido }
    });
  }, [sendMessage]);

  const sendAlert = useCallback((tipo: string, ubicacion: string, descripcion: string, severidad: string) => {
    return sendMessage({
      type: 'send_alert',
      payload: { tipo, ubicacion, descripcion, severidad }
    });
  }, [sendMessage]);

  const sendCheckin = useCallback((zonaId: string, lat?: number, lng?: number, notas?: string) => {
    return sendMessage({
      type: 'checkin',
      payload: { zonaId, lat, lng, notas }
    });
  }, [sendMessage]);

  const sendTyping = useCallback((destinatarioId: string) => {
    return sendMessage({
      type: 'typing',
      payload: { destinatarioId }
    });
  }, [sendMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { 
    sendMessage, 
    sendChatMessage,
    sendAlert,
    sendCheckin,
    sendTyping,
    disconnect,
    isConnected
  };
};
