import React, { useState } from "react";
import styled from "styled-components";
import ChatWindow from "./components/ChatWindow.jsx";

// Importe suas imagens locais
import avatarAlexandre from "./assets/alexandre.jpg";
import avatarLivia from "./assets/carmen_lucia.jpg";

// --- DADOS DA SIMULAÇÃO ---

const userA = {
  name: "Alexandre de Morais",
  avatar: avatarAlexandre,
};
const userB = {
  name: "Cármen Lúcia",
  avatar: avatarLivia,
};

const initialConversation = [
  { senderId: "A", text: "Olá, Cármen! Como está o STF?" },
  {
    senderId: "B",
    text: "Oi, Alexandre! Está tudo bem. Prendemos um criminoso semana passada.",
  },
  {
    senderId: "A",
    text: "Excelente! Lugar de bandido é na cadeia! Faz o L.",
  },
];

const AppContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #0f0f1a;
  box-sizing: border-box;
`;

function App() {
  const [conversation, setConversation] = useState(initialConversation);

  const handleSendMessage = (text, senderId) => {
    const newMessage = { senderId, text };
    setConversation((currentConversation) => [
      ...currentConversation,
      newMessage,
    ]);
  };

  // Perspectiva de Alexandre: mensagens de 'A' são 'sent' (enviadas)
  const messagesForA = conversation.map((msg) => ({
    ...msg,
    sent: msg.senderId === "A",
  }));

  // Perspectiva de Lívia: mensagens de 'B' são 'sent' (enviadas)
  const messagesForB = conversation.map((msg) => ({
    ...msg,
    sent: msg.senderId === "B",
  }));

  return (
    <AppContainer>
      {/* Janela de Alexandre */}
      <ChatWindow
        contactUser={userB} // O header mostra a Lívia
        messages={messagesForA} // <<< CORRIGIDO: Usa a perspectiva do Alexandre
        onSendMessage={(text) => handleSendMessage(text, "A")}
      />
      {/* Janela de Lívia */}
      <ChatWindow
        contactUser={userA} // O header mostra o Alexandre
        messages={messagesForB} // <<< CORRIGIDO: Usa a perspectiva da Lívia
        onSendMessage={(text) => handleSendMessage(text, "B")}
      />
    </AppContainer>
  );
}

export default App;
