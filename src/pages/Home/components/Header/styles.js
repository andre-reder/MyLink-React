import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 40px; */
  width: 100%;

 > h1 {
    font-size: 36px;
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: 12px;

    > strong {
      font-weight: 600;
      font-size: 36px;
      margin-right: 2px;
    }

    > span {
      font-weight: lighter;
      font-size: 36px;
    }
  }

  div {
    font-weight: 100;
    font-size: 18px;

    img {
      width: 100px;
      margin-left: 10px;
      margin-right: 10px;
    }

    /* > span {
      font-weight: 100;
    } */
  }
`;
