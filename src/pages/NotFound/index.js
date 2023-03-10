import { Link } from 'react-router-dom';
import { NotFoundContainer } from './styles';
import notFoundSvg from '../../assets/images/icons/404.svg';

export default function NotFound() {
  return (
    <NotFoundContainer>
      <img src={notFoundSvg} alt="404" />
      <div>
        Página não encontrada! Tente voltar à
        <Link to="/">
          <strong>Página inicial</strong>
        </Link>
      </div>
    </NotFoundContainer>
  );
}
