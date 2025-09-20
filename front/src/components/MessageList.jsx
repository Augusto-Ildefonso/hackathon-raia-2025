import React from "react";
import styled from "styled-components";
import Message from "./Message.jsx";

const MessageListWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: transparent; // <-- MUDANÇA PRINCIPAL

  /* Estilizando a barra de rolagem para combinar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(233, 69, 96, 0.5);
    border-radius: 3px;
  }
`;

function MessageList() {
  const messages = [
    { text: "E aí, tudo certo?", sent: false },
    { text: "Opa, tudo joia! Gostou do novo fundo líquido?", sent: true },
    { text: "Nossa, ficou sensacional! Parece vivo.", sent: false },
    { text: "A ideia era essa! Fica mais dinâmico, né?", sent: true },
  ];

  return (
    <MessageListWrapper>
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} sent={msg.sent} />
      ))}
    </MessageListWrapper>
  );
}

export default MessageList;
