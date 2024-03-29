import styled from 'styled-components';

export const SecondaryButton = styled.button`
      color: ${({ theme, selected }) => (selected ? theme.colors.lighterBackground : theme.colors.primary.main)};
      background: ${({ theme, selected }) => (selected ? theme.colors.primary.main : theme.colors.background)};
      text-decoration: none;
      font-weight: bold;
      border: 2px solid ${({ theme }) => theme.colors.primary.main};
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.2s ease-in;
      font-size: 14px;
      height: 36px;
      margin: 1px;
      display: ${({ invisible }) => invisible && 'none'}!important;
      width: auto;
      min-width: 65px;

      @media(max-width: 500px) {
        font-size: 12px;
        height: 60px;
        padding: 2px 4px;
      }

      & + & {
        margin-left: 8px;
      }

      &:hover {
        background: ${({ theme, selected }) => (selected ? theme.colors.primary.background : theme.colors.primary.main)};
        color: ${({ theme }) => (theme.colors.lighterBackground)};
      }
`;
