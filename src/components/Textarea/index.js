import PropTypes from 'prop-types';
import { StyledTextarea } from './styles';

export default function Textarea({
  value,
  placeholder,
  onChange,
  darkBorder,
  height,
  // error,
}) {
  return (
    <StyledTextarea
      placeholder={placeholder}
      onChange={onChange}
      darkBorder={darkBorder}
      height={height}
      value={value}
      maxLength={300}
      // error={error}
    />
  );
}

Textarea.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.string.isRequired,
  darkBorder: PropTypes.bool,
  height: PropTypes.number,
  // error: PropTypes.string,
};

Textarea.defaultProps = {
  darkBorder: false,
  height: 150,
  // error: '',
};
