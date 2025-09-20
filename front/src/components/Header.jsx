import React from "react";
import styled from "styled-components";
import { FiChevronLeft, FiMoreVertical } from "react-icons/fi";

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
const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #e94560;
  object-fit: cover;
`;
const UserName = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
`;
const Actions = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
`;

function Header({ user }) {
  // Se o usuário não for carregado ainda, não quebra
  if (!user) return null;

  return (
    <HeaderWrapper>
      <UserInfo>
        <FiChevronLeft size={28} />
        <Avatar src={user.avatar} alt={`Avatar de ${user.name}`} />
        <UserName>{user.name}</UserName>
      </UserInfo>
      <Actions>
        <FiMoreVertical />
      </Actions>
    </HeaderWrapper>
  );
}

export default Header;
