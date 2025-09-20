import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Message from "./Message.jsx";

const MessageListWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: transparent;
`;

function MessageList({ messages }) {
  const endOfMessagesRef = useRef(null);

  // Rola para o final sempre que uma nova mensagem chega
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
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
