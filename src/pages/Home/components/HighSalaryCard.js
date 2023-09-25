import PropTypes from 'prop-types';
import FormGroup from '../../../components/FormGroup';
import FilterRadioButton from '../../../components/FilterRadioButtons';
import { FilterRadioButtonsContainer } from '../../../components/FilterRadioButtonsContainer';

export default function HighSalaryCard({
  isHighSalary,
  setIsHighSalary,
}) {
  return (
    <>
      <div className="title">
        Seu salário é maior que R$ 3.221,00?
      </div>
      <FormGroup centered>
        <FilterRadioButtonsContainer>
          <FilterRadioButton onClick={() => setIsHighSalary(true)} selected={isHighSalary}>
            Sim
          </FilterRadioButton>
          <FilterRadioButton onClick={() => setIsHighSalary(false)} selected={!isHighSalary}>
            Não
          </FilterRadioButton>
        </FilterRadioButtonsContainer>
      </FormGroup>
    </>
  );
}

HighSalaryCard.propTypes = {
  isHighSalary: PropTypes.bool.isRequired,
  setIsHighSalary: PropTypes.func.isRequired,
};
