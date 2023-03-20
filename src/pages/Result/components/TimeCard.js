import PropTypes from 'prop-types';
import { Card } from '../styles';
import clock from '../../../assets/images/icons/clock.svg';

export default function Timecard({ walkTime }) {
  return (
    <Card>
      <header>
        <img src={clock} alt="" />
        <span>Tempo caminhado</span>
      </header>

      <div>
        {walkTime}
        {' '}
        min
      </div>
    </Card>
  );
}

Timecard.propTypes = {
  walkTime: PropTypes.number.isRequired,
};
