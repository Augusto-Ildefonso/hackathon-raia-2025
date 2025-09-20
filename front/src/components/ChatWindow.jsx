import React from "react";
import styled, { keyframes } from "styled-components";
import Header from "./Header.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

// Animação e Estilos do Wrapper (sem alteração)
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 95vh;
  max-height: 800px;
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  background: linear-gradient(45deg, #1a1a2e, #16213e, #e94560, #0f3460);
  background-size: 400% 400%;
  animation: ${moveGradient} 15s ease infinite;
`;

// Este componente agora recebe as informações da pessoa de contato (contactUser)
// para exibir no Header, e a função onSendMessage para o Input.
function ChatWindow({ contactUser, messages, onSendMessage }) {
  return (
    <ChatWrapper>
      <Header user={contactUser} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </ChatWrapper>
  );
}

export default ChatWindow;
