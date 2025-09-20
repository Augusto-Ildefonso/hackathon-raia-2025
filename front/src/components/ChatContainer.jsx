import React from "react";
import styled from "styled-components";
import Header from "./Header";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 600px; /* Largura similar a um app mobile */
  margin: 0 auto;
  border: 1px solid #ddd;
  background-color: #f0f0f0; /* Cor de fundo do WhatsApp */
`;

function ChatContainer() {
  return (
    <ChatContainerWrapper>
      <Header />
      <MessageList />
      <MessageInput />
    </ChatContainerWrapper>
  );
}

export default ChatContainer;
