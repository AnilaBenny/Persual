import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Nav = styled.nav`
  background-color: #1c0c2c;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #da4ea2;
`;

const MenuItems = styled.ul`
  display: flex;
  list-style: none;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 100%;
    height: calc(100vh - 60px);
    background-color: #1c0c2c;
    transition: all 0.3s ease-in-out;
    padding: 1rem 0;
  }
`;

const MenuItem = styled.li`
  margin: 0 1rem;

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const MenuLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #da4ea2;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav>
      <Logo>Persual</Logo>
      <MenuButton onClick={toggleMenu}>
        {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </MenuButton>
      <MenuItems isOpen={isOpen}>
        <MenuItem>
          <MenuLink href="/home" onClick={() => setIsOpen(false)}>Home</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="/article" onClick={() => setIsOpen(false)}>Article</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#contact" onClick={() => setIsOpen(false)}>Contact</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#about" onClick={() => setIsOpen(false)}>About</MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#logout" onClick={() => setIsOpen(false)}>Logout</MenuLink>
        </MenuItem>
      </MenuItems>
    </Nav>
  );
};

export default Navbar;