import styled from 'styled-components';

export const SecondaryButton = styled.button`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  font-weight: bold;
  border: 2px solid ${({ theme }) => theme.colors.primary.main};
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease-in;
  margin: 0px;
  width: 100%;
  &:hover {
    background: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.lighterBackground};
  }
`;
