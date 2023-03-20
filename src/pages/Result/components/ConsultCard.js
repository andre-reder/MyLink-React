import PropTypes from 'prop-types';
import { Card } from '../styles';
import clipboard from '../../../assets/images/icons/clipboard.svg';

export default function ConsultCard({ consultCode }) {
  return (
    <Card background="#7289da">
      <header>
        <img src={clipboard} alt="" />
        <span>Número da consulta</span>
      </header>

      <div>
        {consultCode}
      </div>
    </Card>
  );
}

ConsultCard.propTypes = {
  consultCode: PropTypes.number.isRequired,
};
