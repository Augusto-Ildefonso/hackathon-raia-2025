import React, { useState } from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/SocketContext.jsx";

// ...existing code...
const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(15, 15, 26, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  padding: 0 5px 0 20px;
`;

const InputField = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: #f0f0f0;
  padding: 15px 0;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;

  &::placeholder {
    color: #a9a9b3;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FocusBorder = styled(motion.div)`
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #f857a6, #ff5858);
  border-radius: 999px;
  z-index: -1;
`;

const SendButton = styled(motion.button)`
  font-size: 1.5rem;
  color: ${props => (props.hasText && props.isConnected) ? "#e94560" : "#a9a9b3"};
  cursor: ${props => (props.hasText && props.isConnected) ? "pointer" : "not-allowed"};
  background: none;
  border: none;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`;

function MessageInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { isConnected } = useSocket();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "" || !isConnected) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const hasText = inputValue.length > 0;

  const borderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <InputWrapper onSubmit={handleSubmit}>
      <InputContainer>
        <FocusBorder
          variants={borderVariants}
          initial="hidden"
          animate={isFocused ? "visible" : "hidden"}
          transition={{ duration: 0.3 }}
        />
        <InputField
          placeholder={isConnected ? "Digite uma mensagem..." : "Conectando..."}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={!isConnected}
        />
      </InputContainer>

      <SendButton
        type="submit"
        hasText={hasText}
        isConnected={isConnected}
        whileHover={hasText && isConnected ? { scale: 1.15, y: -2 } : {}}
        whileTap={hasText && isConnected ? { scale: 0.9 } : {}}
        disabled={!hasText || !isConnected}
      >
        <FiSend />
      </SendButton>
    </InputWrapper>
  );
}

export default MessageInput;