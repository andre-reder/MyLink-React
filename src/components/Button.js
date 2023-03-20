import styled, { css } from 'styled-components';

export default styled.button`
  height: ${({ small }) => (small ? '36px' : '40px')};
  max-width: 150px;
  min-width: 120px;
  padding: ${({ small }) => (small ? '0 8px' : '0 12px')};
  border: none;
  background: ${({ theme, background }) => (background || theme.colors.primary.main)};
  font-size: ${({ small }) => (small ? '14px' : '16px')};
  box-shadow: 8px 4px 10px rgba(0, 0, 0, 0.04);
  font-weight: bold;
  color: ${({ theme }) => theme.colors.lighterBackground};
  border-radius: 8px;
  transition: all 0.2s ease-in;

  @media(max-width: 800px){
    width: 110px;
    height: 36px;
    padding: 0 2px;
    font-size: 14px;
  }

  &:hover {
    /* background: ${({ theme }) => theme.colors.primary.light}; */
    opacity: 0.8;
  }

  &:active {
    background: ${({ theme }) => theme.colors.primary.dark};
  }

  &[disabled] {
    opacity: 0.5;
    background: ${({ theme }) => theme.colors.primary.main};
    cursor: not-allowed;
  }

  ${({ theme, danger }) => (
    danger && css`
      background: ${theme.colors.danger.main};

  &:hover {
    background: ${theme.colors.danger.light};
  }

  &:active {
    background: ${theme.colors.danger.dark};
  }
    `
  )}
`;
