import PropTypes from 'prop-types';
import captaLogo from '../../../../assets/images/captaLogo.svg';
import { Container } from './styles';

export default function Header({ logoSrc }) {
  return (
    <Container>
      <h1>
        <strong>My</strong>
        <span>Link</span>
      </h1>

      <div>
        Uma tecnologia
        <img src={logoSrc || captaLogo} alt="" />
      </div>
    </Container>
  );
}

Header.propTypes = {
  logoSrc: PropTypes.string,
};

Header.defaultProps = {
  logoSrc: '',
};
