import React from "react";
import styled, { keyframes } from "styled-components";
import Header from "./Header.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import { useSocket } from "../contexts/SocketContext.jsx";

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  background: linear-gradient(45deg, #1a1a2e, #16213e, #e94560, #0f3460);
  background-size: 400% 400%;
  animation: ${moveGradient} 15s ease infinite;
`;

const ConnectionStatus = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  color: ${(props) => (props.isConnected ? "#4CAF50" : "#f44336")};
  background: rgba(0, 0, 0, 0.2);
`;

function ModernChatContainer() {
  const { messages, isConnected, sendMessage } = useSocket();

  const handleSendMessage = (text) => {
    sendMessage(text);
  };

  return (
    <ChatWrapper>
      <Header />
      <ConnectionStatus isConnected={isConnected}>
        {isConnected ? "🟢 Conectado" : "🔴 Conectando..."}
      </ConnectionStatus>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatWrapper>
  );
}

export default ModernChatContainer;
