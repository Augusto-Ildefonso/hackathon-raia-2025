import React, { useState } from "react";
import styled from "styled-components";
import { FiSmile, FiPlus, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- STYLES ---

const InputWrapper = styled.form`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;

  /* Efeito de vidro aprimorado */
  background: rgba(15, 15, 26, 0.5); /* Um pouco mais escuro e transparente */
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
  border-radius: 999px; /* Totalmente arredondado */
  padding: 0 5px 0 20px; /* Espaçamento interno */
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
`;

const FocusBorder = styled(motion.div)`
  position: absolute;
  inset: -2px; /* Fica 2px para fora do container */
  background: linear-gradient(45deg, #f857a6, #ff5858);
  border-radius: 999px;
  z-index: -1; /* Fica atrás do input */
`;

const BaseIconButton = styled(motion.button)`
  font-size: 1.5rem;
  color: #a9a9b3;
  cursor: pointer;
  background: none;
  border: none;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// --- COMPONENT ---

function MessageInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const hasText = inputValue.length > 0;

  // Variantes para a animação da borda de foco
  const borderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Variantes para a animação de troca de ícone (plus/send)
  const iconVariants = {
    hidden: { opacity: 0, x: 10, scale: 0.8 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -10, scale: 0.8 },
  };

  return (
    <InputWrapper onSubmit={handleSubmit}>
      <BaseIconButton
        type="button"
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiSmile />
      </BaseIconButton>

      <InputContainer>
        <FocusBorder
          variants={borderVariants}
          initial="hidden"
          animate={isFocused ? "visible" : "hidden"}
          transition={{ duration: 0.3 }}
        />
        <InputField
          placeholder="Digite uma mensagem..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </InputContainer>

      {/* Container para a animação de troca de ícone */}
      <div style={{ position: "relative", width: "48px", height: "48px" }}>
        <AnimatePresence initial={false} mode="wait">
          <BaseIconButton
            key={hasText ? "send" : "plus"}
            type={hasText ? "submit" : "button"}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: hasText ? "#e94560" : "#a9a9b3",
            }}
          >
            {hasText ? <FiSend /> : <FiPlus />}
          </BaseIconButton>
        </AnimatePresence>
      </div>
    </InputWrapper>
  );
}

export default MessageInput;
