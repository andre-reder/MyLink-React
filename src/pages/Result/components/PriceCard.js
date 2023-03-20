import PropTypes from 'prop-types';
import { Card } from '../styles';
import coins from '../../../assets/images/icons/coins.svg';
import formatCurrency from '../../../utils/formatCurrency';

export default function PriceCard({ totalPrice }) {
  return (
    <Card background="#5cb85c">
      <header>
        <img src={coins} alt="" />
        <span>Valor total / dia</span>
      </header>

      <div>
        {formatCurrency(totalPrice)}
      </div>
    </Card>
  );
}

PriceCard.propTypes = {
  totalPrice: PropTypes.number.isRequired,
};
