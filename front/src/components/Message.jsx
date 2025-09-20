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
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;

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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  background: ${props => props.isTrue ? '#4CAF50' : '#f44336'};
  color: white;
`;

const InfoSection = styled.div`
  margin-bottom: 8px;
  
  strong {
    color: #FFD700;
    display: block;
    margin-bottom: 4px;
  }
`;

function Message({ text, sent }) {
  // Função para formatar a mensagem estruturada
  const formatStructuredMessage = (text) => {
    // Detecta se é uma mensagem do sistema (começa com ✅ ou ❌)
    const isSystemMessage = text.startsWith('✅') || text.startsWith('❌');
    
    if (!isSystemMessage) {
      return { isStructured: false, content: text };
    }

    const isVeridico = text.startsWith('✅');
    
    // Remove o emoji inicial
    const cleanText = text.replace(/^[✅❌]\s*/, '');
    
    // Extrai informações usando regex melhorada
    const chanceMatch = cleanText.match(/Chance de ser real: '(\d+)%'/);
    
    // Regex mais específica para capturar todo o resumo até o link
    const resumoMatch = cleanText.match(/Resumo da notícia: (.*?)(?=\n\([^)]+\)|$)/s);
    
    // Se não encontrou com a regex acima, tenta uma alternativa
    const resumoAlternativo = cleanText.match(/Resumo da notícia: (.*?)(?=\([^)]+\)|$)/s);
    
    const linkMatch = cleanText.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Escolhe o melhor match para o resumo
    let resumo = '';
    if (resumoMatch && resumoMatch[1]) {
      resumo = resumoMatch[1].trim();
    } else if (resumoAlternativo && resumoAlternativo[1]) {
      resumo = resumoAlternativo[1].trim();
    } else {
      // Se não conseguiu extrair o resumo, pega tudo após "Resumo da notícia:"
      const resumoIndex = cleanText.indexOf('Resumo da notícia:');
      if (resumoIndex !== -1) {
        resumo = cleanText.substring(resumoIndex + 'Resumo da notícia:'.length).trim();
        // Remove o link se estiver no final
        resumo = resumo.replace(/\([^)]+\)\s*$/g, '').trim();
      } else {
        resumo = cleanText;
      }
    }

    return {
      isStructured: true,
      isVeridico,
      chance: chanceMatch ? chanceMatch[1] : null,
      resumo: resumo,
      link: linkMatch ? { text: linkMatch[1], url: linkMatch[2] } : null
    };
  };

  const messageData = formatStructuredMessage(text);

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
      <MessageBubble sent={sent}>
        {messageData.isStructured ? (
          <div>
            <StatusBadge isTrue={messageData.isVeridico}>
              {messageData.isVeridico ? '✅ VERIFICADO' : '❌ FAKE NEWS'}
            </StatusBadge>
            
            {messageData.chance && (
              <InfoSection>
                <strong>Probabilidade de ser real:</strong>
                {messageData.chance}%
              </InfoSection>
            )}
            
            <InfoSection>
              <strong>Resumo:</strong>
              {messageData.resumo}
            </InfoSection>
            
            {messageData.link && (
              <InfoSection>
                <strong>Fonte:</strong>
                <a 
                  href={messageData.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#FFD700', textDecoration: 'underline' }}
                >
                  {messageData.link.text}
                </a>
              </InfoSection>
            )}
          </div>
        ) : (
          text
        )}
      </MessageBubble>
    </motion.div>
  );
}

export default Message;