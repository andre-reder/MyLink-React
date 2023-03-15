import styled from 'styled-components';

export const Container = styled.div`
width: 100%;
margin-top: 16px;
/* & + & {
    margin-top: 16px;
  } */

  small {
    color: ${({ theme }) => theme.colors.danger.main};
    font-size: 12px;
    display: block;
    margin-top: 8px;
  }

  .form-item {
    position: relative;
  }

  .loader {
    position: absolute;
    top: 12px;
    right: 16px;
  }
`;
