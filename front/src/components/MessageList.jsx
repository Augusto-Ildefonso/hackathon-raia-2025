import React, { useEffect, useRef } from "react";
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

function MessageList({ messages }) {
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <MessageListWrapper>
      {messages.map((msg, index) => (
        <Message key={index} text={msg.text} sent={msg.sent} />
      ))}
      <div ref={endOfMessagesRef} />
    </MessageListWrapper>
  );
}

export default MessageList;
