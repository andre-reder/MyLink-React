/* eslint-disable max-len */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { WaitingCardContainer } from '../styles';

export default function WaitingCard({ consultCode }) {
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

  return (
    <WaitingCardContainer>
      <header>
        Agora basta aguardar! O número de sua consulta é
        {' '}
        {consultCode}
      </header>

      <span>
        O tempo estimado para seu resultado ser gerado é de 50 segundos. Enquanto isso, enviaremos um link para o seu e-mail, no qual você poderá acessar seu resultado e utilizar em caso de solicitação de ajuste do resultado e para baixar nova carta de opção de Vale-Transporte
      </span>

      <div className="timer">
        {formatTime(seconds)}
      </div>
    </WaitingCardContainer>
  );
}

WaitingCard.propTypes = {
  consultCode: PropTypes.number.isRequired,
};
