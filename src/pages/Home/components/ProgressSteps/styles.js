import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
  padding: 0 16px;

  @media(max-width: 315px){
    margin-bottom: 15px;
  }
`;

export const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  :before {
    content: '';
    position: absolute;
    background: #ccc;
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  :after {
    content: '';
    position: absolute;
    background: ${({ theme }) => theme.colors.primary.main};
    height: 2px;
    width: ${({ width }) => width};
    top: 50%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 0;
  }
`;

export const StepWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const StepStyle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StepCount = styled.span`
  font-size: 12px;
  color: #fff;
  /* @media (max-width: 600px) {
    font-size: 16px;
  } */
`;

export const StepsLabelContainer = styled.div`
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translate(-50%, -50%);

  @media(max-width: 315px){
    white-space: normal;
    text-align: center;
    top: 50px;
  }
`;

export const StepLabel = styled.span`
  font-size: 12px;
  white-space: nowrap;

  @media(max-width: 315px){
    white-space: normal;
    text-align: center;
  }
`;

export const CheckMark = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.main};
  -ms-transform: scaleX(-1) rotate(-46deg); /* IE 9 */
  -webkit-transform: scaleX(-1) rotate(-46deg); /* Chrome, Safari, Opera */
  transform: scaleX(-1) rotate(-46deg);
`;
