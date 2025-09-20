import React, { useState } from "react"; // 1. Importar useState
import styled, { keyframes } from "styled-components";
import Header from "./Header.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

// Animação para o fundo líquido (sem alteração)
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Estilização do ChatWrapper (sem alteração)
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

// DADOS INICIAIS DAS MENSAGENS
const initialMessages = [
  { text: "E aí, tudo certo?", sent: false },
  { text: "Opa, tudo joia! Gostou do novo fundo líquido?", sent: true },
  { text: "Nossa, ficou sensacional! Parece vivo.", sent: false },
];

function ModernChatContainer() {
  // 2. Criar o estado para as mensagens
  const [messages, setMessages] = useState(initialMessages);

  // 3. Criar a função que adiciona uma nova mensagem
  const handleSendMessage = (text) => {
    const newMessage = {
      text: text,
      sent: true, // Todas as novas mensagens são enviadas pelo usuário
    };
    // Atualiza o estado, adicionando a nova mensagem à lista existente
    setMessages([...messages, newMessage]);
  };

  return (
    <ChatWrapper>
      <Header />
      {/* 4. Passar a lista de mensagens para o MessageList */}
      <MessageList messages={messages} />
      {/* 5. Passar a função de envio para o MessageInput */}
      <MessageInput onSendMessage={handleSendMessage} />
    </ChatWrapper>
  );
}

export default ModernChatContainer;
