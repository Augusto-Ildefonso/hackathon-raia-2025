import React, { useState } from "react";
import styled from "styled-components";
import { FiSmile, FiPlus, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
`;

const InputField = styled.input`
  flex: 1;
  background: #2c2c54;
  border: none;
  color: white;
  padding: 15px 20px;
  border-radius: 20px;
  font-size: 1rem;
  margin: 0 15px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e94560;
  }
`;

const IconButton = styled(motion.div)`
  font-size: 1.5rem;
  color: #a9a9b3;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #e94560;
  }
`;

function MessageInput() {
  const [hasText, setHasText] = useState(false);

  const handleInputChange = (e) => {
    setHasText(e.target.value.length > 0);
  };

  return (
    <InputWrapper>
      <InputField
        placeholder="Digite sua mensagem..."
        onChange={handleInputChange}
      />{" "}
      {/* */}
      <IconButton
        key={hasText ? "send" : "plus"}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {hasText ? <FiSend style={{ color: "#e94560" }} /> : <FiPlus />}
      </IconButton>
    </InputWrapper>
  );
}

export default MessageInput;
