import React from "react";
import styled, { keyframes } from "styled-components"; // Importe keyframes
import Header from "./Header.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

// Animação para o fundo líquido
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
  overflow: hidden; // Essencial para manter o conteúdo dentro das bordas arredondadas
  position: relative; // Essencial para o posicionamento do fundo

  // O Design Líquido
  background: linear-gradient(45deg, #1a1a2e, #16213e, #e94560, #0f3460);
  background-size: 400% 400%; // Aumenta o tamanho do gradiente para a animação
  animation: ${moveGradient} 15s ease infinite; // Aplica a animação
`;

function ModernChatContainer() {
  return (
    <ChatWrapper>
      <Header />
      <MessageList />
      <MessageInput />
    </ChatWrapper>
  );
}

export default ModernChatContainer;
