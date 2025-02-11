import PropTypes from 'prop-types';
import FilterRadioButton from '../../../../../../components/FilterRadioButtons';
import { Container } from './styles';

export default function Header({
  view,
  setView,
  isTicketsTabVisible,
}) {
  return (
    <Container>
      <FilterRadioButton selected={view === 'going'} onClick={() => setView('going')}>
        Ida
      </FilterRadioButton>
      <FilterRadioButton selected={view === 'returning'} onClick={() => setView('returning')}>
        Volta
      </FilterRadioButton>
      {isTicketsTabVisible && (
        <FilterRadioButton selected={view === 'tickets'} onClick={() => setView('tickets')}>
          Bilhetes
        </FilterRadioButton>
      )}
    </Container>
  );
}

Header.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
  isTicketsTabVisible: PropTypes.bool,
};

Header.defaultProps = {
  isTicketsTabVisible: true,
};
