import captaLogo from '../../../../assets/images/captaLogo.svg';
import { Container } from './styles';

export default function Header() {
  return (
    <Container>
      <h1>
        <strong>My</strong>
        <span>link</span>
      </h1>

      <div>
        Uma tecnologia
        <img src={captaLogo} alt="" />
      </div>
    </Container>
  );
}
