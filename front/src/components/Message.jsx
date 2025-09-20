import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.sent ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  padding: 12px 20px;
  max-width: 75%;
  font-size: 1rem;
  position: relative;

  ${(props) =>
    props.sent
      ? `
        background: linear-gradient(45deg, #f857a6, #ff5858);
        color: white;
        border-radius: 20px 20px 5px 20px;
      `
      : `
        background-color: #2c2c54;
        color: #f0f0f0;
        border-radius: 20px 20px 20px 5px;
      `}
`;

function Message({ text, sent }) {
  // Animação para cada mensagem aparecer suavemente
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: sent ? "flex-end" : "flex-start",
      }}
    >
      <MessageBubble sent={sent}>{text}</MessageBubble>
    </motion.div>
  );
}

export default Message;
