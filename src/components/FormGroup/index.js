import PropTypes from 'prop-types';
import Spinner from '../Spinner';
import { Container } from './styles';

export default function FormGroup({
  children, error, isLoading, aside,
}) {
  return (
    <Container aside={aside}>
      <div className="form-item">
        { children }

        {isLoading && (
          <div className="loader">
            <Spinner size={14} />
          </div>
        )}
      </div>
      { error && <small>{error}</small> }
    </Container>
  );
}

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  aside: PropTypes.bool,
};

FormGroup.defaultProps = {
  error: null,
  isLoading: false,
  aside: false,
};
