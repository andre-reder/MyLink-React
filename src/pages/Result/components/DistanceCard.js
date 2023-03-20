import PropTypes from 'prop-types';
import { Card } from '../styles';
import walk from '../../../assets/images/icons/walk.svg';

export default function DistanceCard({ walkDistance }) {
  return (
    <Card background="#d9534f">
      <header>
        <img src={walk} alt="" />
        <span>Distância caminhada</span>
      </header>

      <div>
        {walkDistance}
        {' '}
        metros
      </div>
    </Card>
  );
}

DistanceCard.propTypes = {
  walkDistance: PropTypes.number.isRequired,
};
