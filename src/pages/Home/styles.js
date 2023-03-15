import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
`;

export const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.lighterBackground};
  box-shadow: 8px 4px 10px rgba(0, 0, 0, 0.04);
  padding: 16px 32px 24px 32px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  margin-top: 32px;

  .title {
    max-width: 300px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    text-align: center;
    /* text-transform: uppercase; */
  }

  .small {
    text-align: center;
    margin-top: 12px;
  }
`;

export const AsideFormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const WaitingCardContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
  header {
    max-width: 300px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    text-align: center;
  }

  span {
    text-align: left;
    font-size: 12px;
    margin-bottom: 16px;
  }

  div.timer {
    background: #ccc;
    padding: 8px 32px;
    font-size: 32px;
    max-width: fit-content;
    color: ${({ theme }) => theme.colors.primary.main};
    border-radius: 8px;
    text-align: center;
  }
`;
