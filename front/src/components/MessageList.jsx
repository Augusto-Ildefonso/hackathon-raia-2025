import React, { useEffect, useRef } from "react"; // Importar useEffect e useRef
import styled from "styled-components";
import Message from "./Message.jsx";

const MessageListWrapper = styled.div`
  /* Estilos sem alteração */
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(233, 69, 96, 0.5);
    border-radius: 3px;
  }
`;

// 1. Receber 'messages' via props
function MessageList({ messages }) {
  // Hook para auto-scroll
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Roda sempre que a lista de mensagens mudar

  return (
    <MessageListWrapper>
      {/* 2. Mapear a lista recebida */}
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} sent={msg.sent} />
      ))}
      {/* Elemento invisível no final da lista para o scroll */}
      <div ref={endOfMessagesRef} />
    </MessageListWrapper>
  );
}

export default MessageList;
