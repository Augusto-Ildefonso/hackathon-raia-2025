import React from "react";
import styled from "styled-components";
import { FiChevronLeft, FiMoreVertical } from "react-icons/fi";
// Importamos o ícone que será nosso avatar padrão
import { FaUserCircle } from "react-icons/fa";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

// Não precisamos mais do <Avatar> de imagem, apenas do placeholder
const AvatarPlaceholder = styled.div`
  width: 45px;
  height: 45px;
  font-size: 45px; /* Tamanho do ícone */
  color: #a9a9b3; /* Cor cinza para o ícone */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
`;

const Actions = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
    color: #e94560;
  }
`;

// O componente agora não recebe mais nenhuma propriedade (props)
function Header() {
  return (
    <HeaderWrapper>
      <UserInfo>
        <FiChevronLeft size={28} />

        {/* Mostra sempre o ícone de avatar genérico */}
        <AvatarPlaceholder>
          <FaUserCircle />
        </AvatarPlaceholder>

        {/* Mostra sempre um nome de usuário fixo */}
        <UserName>Usuário</UserName>
      </UserInfo>
      <Actions>
        <FiMoreVertical />
      </Actions>
    </HeaderWrapper>
  );
}

export default Header;
