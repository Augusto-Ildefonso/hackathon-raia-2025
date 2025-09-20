import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser usado dentro de um SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    // Ajuste a URL conforme necessário
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket']
    });

    setSocket(newSocket);

    // Eventos de conexão
    newSocket.on('connect', () => {
      console.log('Conectado ao servidor:', newSocket.id);
      setIsConnected(true);
      setUserId(newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado do servidor');
      setIsConnected(false);
    });

    // Escutar mensagens recebidas
    newSocket.on('message', (messageData) => {
      console.log('Mensagem recebida:', messageData);
      setMessages(prevMessages => [...prevMessages, messageData]);
    });

    // Escutar mensagens do histórico (caso o servidor envie)
    newSocket.on('messageHistory', (history) => {
      console.log('Histórico de mensagens:', history);
      setMessages(history);
    });

    // Cleanup na desmontagem
    return () => {
      newSocket.close();
    };
  }, []);

  // Função para enviar mensagem
  const sendMessage = (messageText) => {
    if (socket && messageText.trim()) {
      const messageData = {
        text: messageText,
        userId: userId,
        timestamp: new Date().toISOString(),
        sent: true
      };

      // Enviar mensagem para o servidor
      socket.emit('message', messageData);
      
      // Adicionar mensagem localmente (otimistic update)
      setMessages(prevMessages => [...prevMessages, messageData]);
      
      console.log('Mensagem enviada:', messageData);
    }
  };

  // Função para entrar em uma sala específica (se necessário)
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
      console.log('Entrando na sala:', roomId);
    }
  };

  const contextValue = {
    socket,
    messages,
    isConnected,
    userId,
    sendMessage,
    joinRoom,
    setMessages
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};