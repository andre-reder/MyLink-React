import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  padding: 0;
  width: 100%;

  @media(min-width: 800px){
    padding-left: 16.25rem;
  }
`;

export const Display = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 1;
  /* position: relative; */
  padding: 16px;

  @media(max-width: 800px){
    padding-left: 50px;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: ${({ theme, background }) => background || theme.colors.primary.main};
  padding: 8px;
  width: 22%;
  gap: 8px;
  border-radius: 8px;
  height: 100%;

  @media(max-width: 800px){
    /* gap: 4px; */
    align-items: center;
    justify-content: space-between;

    width: 24.5%;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
    color: #fff;

    img {
      width: 20px;
      height: 20px;
    }

    span {
      font-weight: bold;
      text-align: center;
    }

    @media(max-width: 800px){
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
      width: 15px;
      height: 15px;
     }

      span {
        font-weight: bold;
        font-size: 12px;
      }
    }

  }
  div {
    color: #fff;
  }

  @media(max-width: 800px){
    div {
      font-size: 12px;
      text-align: center;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  z-index: 1;

  a {
    text-decoration: none;
    background: transparent;
  }

  @media(max-width: 800px){
    gap: 4px;
    padding: 4px;
    margin-bottom: 95px;
  }
`;

export const MapContainer = styled.div`
  flex: 1;
  z-index: 0;
  overflow: hidden;
  position: fixed;
  /* left: 8px; */
  /* @media(max-width: 800px){
    margin-left: -10px;
  } */
`;

export const TicketGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0px 10px;
  padding-bottom: 16px;
  position: relative;

  & + & {
    padding-top: 16px;
  }
`;

export const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;

  > * {
    flex: 1;
  }
`;

export const Title = styled.div`
  font-weight: bold;
`;

export const TicketDescription = styled.div`
  font-size: 0.9em;
`;

export const TicketTotal = styled.div`
  font-weight: bold;
  font-size: 0.9em;
`;

export const TotalContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary.main};
  color: #fff;
  font-weight: bold;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
`;

export const AcceptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 400px;
  overflow: auto;
`;

export const AcceptModalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* gap: 16px; */
  max-height: 400px;
  overflow: auto;
`;

export const RefuseModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  /* max-height: 400px;
  overflow: auto; */
`;

export const SingatureContainer = styled.div`
  border: ${({ theme }) => `1px solid ${theme.colors.gray[200]}`};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0px;

  button {
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

      &:hover {
        background: ${({ theme, selected }) => (selected ? theme.colors.primary.background : theme.colors.primary.main)};
        color: ${({ theme }) => (theme.colors.lighterBackground)};
      }

      @media(max-width: 500px) {
        font-size: 12px;
        height: 60px;
        padding: 2px 4px;
      }

  }

  span {
    font-size: 16px;
    font-weight: bold;
  }
  `;
