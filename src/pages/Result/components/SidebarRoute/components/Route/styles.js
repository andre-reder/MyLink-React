import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-top: 0px;
`;

export const InstructionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 10px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 80px;
    left: 24.5px;
    bottom: -80px;
    width: 2px;
    background-color: ${({ theme }) => theme.colors.primary.main};;
  }

  &:last-of-type::before {
    display: none;
  }
`;

export const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme, logo }) => (logo ? '#ccc' : theme.colors.primary.main)};
  z-index: 2;

  img {
    width: 70%;
    height: 70%;
  }

  img.noBg {
    mix-blend-mode: color-burn;
    aspect-ratio: 3/3;
    object-fit: contain;
  }
`;

export const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;

  > * {
    flex: 1;
  }
`;

export const StepTitle = styled.div`
  font-weight: bold;
`;

export const StepDescription = styled.div`
  font-size: 0.9em;

  .transport {
    text-transform: uppercase;
    font-size: 0.95em;
  }

  div {
    font-size: 0.9em;
    margin-top: 4px;
  }
`;

export const DistanceTime = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Distance = styled.div`
  font-size: 0.9em;
  margin-right: 5px;
`;

export const Time = styled.div`
  font-size: 0.9em;
`;

export const Price = styled.div`
  font-size: 0.9em;
  font-weight: bold;
  margin-right: 5px;
`;

export const TicketGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 10px;
  position: relative;
  z-index: 1;
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
