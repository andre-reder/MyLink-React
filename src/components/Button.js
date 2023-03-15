import styled, { css } from 'styled-components';

export default styled.button`
  height: ${({ small }) => (small ? '36px' : '48px')};
  width: 120px;
  padding: ${({ small }) => (small ? '0 8px' : '0 12px')};
  border: none;
  background: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ small }) => (small ? '14px' : '16px')};
  box-shadow: 8px 4px 10px rgba(0, 0, 0, 0.04);
  font-weight: bold;
  color: ${({ theme }) => theme.colors.lighterBackground};
  border-radius: 8px;
  transition: background 0.2s ease-in;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.light};
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
