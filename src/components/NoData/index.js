import PropTypes from 'prop-types';
import { NoDataContainer } from './styles';
import emptyBox from '../../assets/images/icons/emptyBox.svg';
import sad from '../../assets/images/icons/sad.svg';
import ok from '../../assets/images/icons/ok.svg';

export default function NoData({ icon, label }) {
  return (
    <NoDataContainer>
      {icon === 'emptyBox' && (
        <img src={emptyBox} alt="emptyBox" />
      )}
      {icon === 'sad' && (
        <img src={sad} alt="emptyBox" />
      )}
      {icon === 'ok' && (
        <img src={ok} alt="emptyBox" />
      )}
      <span>{label}</span>
    </NoDataContainer>
  );
}

NoData.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
};
