import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  width: 100%;

 > h1 {
    font-size: 36px;
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: 12px;

    > strong {
      font-weight: 900;
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
      aspect-ratio: 4/2;
      object-fit: contain;
      margin-left: 10px;
      margin-right: 10px;
    }

    /* > span {
      font-weight: 100;
    } */
  }
`;
