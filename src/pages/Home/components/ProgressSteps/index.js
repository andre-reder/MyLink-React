import PropTypes, { shape } from 'prop-types';
import {
  CheckMark,
  MainContainer,
  StepContainer,
  StepCount,
  StepLabel,
  StepsLabelContainer,
  StepStyle,
  StepWrapper,
} from './styles';

export default function ProgressSteps({ steps, activeStep }) {
  const totalSteps = steps.length;

  const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`;

  return (
    <MainContainer>
      <StepContainer width={width}>
        {steps.map(({ step, label }) => (
          <StepWrapper key={step}>
            <StepStyle step={activeStep >= step ? 'completed' : 'incomplete'}>
              {activeStep > step ? (
                <CheckMark>L</CheckMark>
              ) : (
                <StepCount>{step}</StepCount>
              )}
            </StepStyle>
            <StepsLabelContainer>
              <StepLabel key={step}>{label}</StepLabel>
            </StepsLabelContainer>
          </StepWrapper>
        ))}
      </StepContainer>
    </MainContainer>
  );
}

ProgressSteps.propTypes = {
  steps: PropTypes.arrayOf(shape({
    label: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
  })).isRequired,
  activeStep: PropTypes.number.isRequired,
};
