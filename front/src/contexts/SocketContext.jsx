import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

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
  
  // UseRef para manter controle das mensagens já processadas
  const processedMessagesRef = useRef(new Set());

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    const newSocket = io('http://localhost:3000', {
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
      setUserId(null);
    });

    // SOLUÇÃO ANTI-DUPLICAÇÃO
    const handleChatMessage = (data) => {
      console.log('Mensagem recebida:', data);
      
      // Criar ID único baseado em múltiplos fatores
      const messageKey = `${data.senderId || 'unknown'}-${data.timestamp}-${(data.message || '').substring(0, 30)}`;
      
      // Verificar se já processamos esta mensagem
      if (processedMessagesRef.current.has(messageKey)) {
        console.log('Mensagem duplicada ignorada:', messageKey);
        return;
      }
      
      // Marcar como processada
      processedMessagesRef.current.add(messageKey);
      
      // Limpar cache antigo (manter só as últimas 50)
      if (processedMessagesRef.current.size > 50) {
        const keys = Array.from(processedMessagesRef.current);
        processedMessagesRef.current.clear();
        keys.slice(-25).forEach(key => processedMessagesRef.current.add(key));
      }
      
      // Criar objeto da mensagem
      const messageData = {
        id: messageKey,
        text: data.message || data,
        userId: data.senderId || 'server',
        timestamp: data.timestamp || new Date().toISOString(),
        sent: data.senderId === newSocket.id,
        hasUrl: data.hasUrl || false
      };

      // Adicionar mensagem ao estado
      setMessages(prevMessages => {
        // Verificação extra: não adicionar se já existe uma mensagem com mesmo ID
        const exists = prevMessages.some(msg => msg.id === messageData.id);
        if (exists) {
          console.log('Mensagem já existe no estado, ignorando');
          return prevMessages;
        }
        
        console.log('Adicionando nova mensagem:', messageData.text);
        return [...prevMessages, messageData];
      });
    };

    // Registrar listener
    newSocket.on('chat message', handleChatMessage);

    // Cleanup
    return () => {
      newSocket.off('chat message', handleChatMessage);
      newSocket.close();
    };
  }, []);

  // Função para enviar mensagem
  const sendMessage = (messageText) => {
    if (socket && messageText.trim()) {
      console.log('Enviando mensagem:', messageText);
      
      // Não adicionar mensagem local - aguardar resposta do servidor
      socket.emit('chat message', messageText);
    }
  };

  // Função para limpar chat
  const clearMessages = () => {
    setMessages([]);
    processedMessagesRef.current.clear();
  };

  const value = {
    socket,
    messages,
    isConnected,
    userId,
    sendMessage,
    clearMessages
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};