/* eslint-disable max-len */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import renderArrayWithComa from '../../../utils/renderArrayWithComa';
import { WaitingCardContainer } from '../styles';

export default function WaitingCard({ consultCode, sentEmail, sentWhatsapp }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secondsDisplay = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secondsDisplay < 10 ? '0' : ''}${secondsDisplay}`;
  };

  const channelsThatMessageWasSent = [sentEmail ? 'e-mail' : '', sentWhatsapp ? 'WhatsApp' : ''].filter((x) => !!x);

  return (
    <WaitingCardContainer>
      <header>
        Agora basta aguardar! O número de sua consulta é
        {' '}
        {consultCode}
      </header>

      <span>
        O tempo estimado para seu resultado ser gerado é de 50 segundos. Enviamos o link para acesso ao resultado no seu
        {' '}
        {renderArrayWithComa(channelsThatMessageWasSent)}
        , onde você poderá solicitar algu ajuste se necessário, ou aceitar o resultado e concluir o seu processo.
      </span>

      <div className="timer">
        {formatTime(seconds)}
      </div>
    </WaitingCardContainer>
  );
}

WaitingCard.propTypes = {
  consultCode: PropTypes.number.isRequired,
  sentEmail: PropTypes.bool.isRequired,
  sentWhatsapp: PropTypes.bool.isRequired,
};
