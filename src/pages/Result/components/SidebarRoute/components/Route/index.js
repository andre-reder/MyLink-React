/* eslint-disable max-len */
import PropTypes, { shape } from 'prop-types';
import bus from '../../../../../../assets/images/icons/bus.svg';
import ferry from '../../../../../../assets/images/icons/ferry.svg';
import subway from '../../../../../../assets/images/icons/subway.svg';
import train from '../../../../../../assets/images/icons/train.svg';
import walk from '../../../../../../assets/images/icons/walk.svg';
import OpacityAnimation from '../../../../../../components/OpacityAnimation';
import formatCurrency from '../../../../../../utils/formatCurrency';
import {
  Container, Distance, DistanceTime, IconContainer, InstructionGroup, Instructions, Price, StepDescription, StepTitle, TicketDescription, TicketGroup, TicketInfo, TicketTotal, Time, Title, TotalContainer,
} from './styles';

export default function Route({
  goingRoute,
  returningRoute,
  view,
  tickets,
}) {
  const iconsMap = {
    Caminhada: walk,
    Trem: train,
    Ônibus: bus,
    Metrô: subway,
    Fretado: bus,
    Fluvial: ferry,
    Integração: bus,
  };

  const totalVt = tickets.reduce((acc, cur) => (
    acc + cur.totVt
  ), 0);

  return (
    <Container>
      {view === 'going' && (
        <OpacityAnimation delay={0.15}>
          {goingRoute.map((routeData) => (
            <InstructionGroup key={Math.random() + routeData.distanciaTj}>
              <IconContainer>
                <img src={iconsMap[routeData.tipoTransp]} alt="" />
              </IconContainer>

              <Instructions>
                <StepTitle>
                  {routeData.tipoTransp === 'Caminhada'
                    ? 'Caminhe'
                    : routeData.descricaoCaminhada}
                </StepTitle>

                <StepDescription>
                  {routeData.tipoTransp === 'Caminhada'
                    ? (
                      <div>
                        {`De ${routeData.origemCaminhada} até ${routeData.destinoCaminhada}`}
                      </div>
                    )
                    : (
                      <>
                        <div className="transport">
                          {`${routeData.operadora ?? ''} ${routeData.letreiroTransporte}`}
                        </div>
                        <div>
                          {routeData.embarque ? `Em ${routeData.embarque}` : ''}
                          {routeData.desembarque ? ` e viaje até ${routeData.desembarque}` : ''}
                        </div>
                      </>
                    )}
                </StepDescription>

                <DistanceTime>
                  {routeData.tipoTransp !== 'Caminhada' && (
                    <Price>{formatCurrency(routeData.valorBilTrecho)}</Price>
                  )}
                  <Distance>{`${routeData.distanciaTj}m`}</Distance>
                  <Time>{`${routeData.tempoTj}min`}</Time>
                </DistanceTime>
              </Instructions>
            </InstructionGroup>
          ))}
        </OpacityAnimation>
      )}

      {view === 'returning' && (
      <OpacityAnimation delay={0.15}>
        {returningRoute.map((routeData) => (
          <InstructionGroup key={Math.random() + routeData.distanciaTj}>
            <IconContainer>
              <img src={iconsMap[routeData.tipoTransp]} alt="" />
            </IconContainer>

            <Instructions>
              <StepTitle>
                {routeData.tipoTransp === 'Caminhada'
                  ? 'Caminhe'
                  : routeData.descricaoCaminhada}
              </StepTitle>

              <StepDescription>
                {routeData.tipoTransp === 'Caminhada'
                  ? (
                    <div>
                      {`De ${routeData.origemCaminhada} até ${routeData.destinoCaminhada}`}
                    </div>
                  )
                  : (
                    <>
                      <div className="transport">
                        {`${routeData.operadora ?? ''} ${routeData.letreiroTransporte}`}
                      </div>
                      <div>
                        {routeData.embarque ? `Em ${routeData.embarque}` : ''}
                        {routeData.desembarque ? ` e viaje até ${routeData.desembarque}` : ''}
                      </div>
                    </>
                  )}
              </StepDescription>

              <DistanceTime>
                {routeData.tipoTransp !== 'Caminhada' && (
                <Price>{formatCurrency(routeData.valorBilTrecho)}</Price>
                )}
                <Distance>{`${routeData.distanciaTj}m`}</Distance>
                <Time>{`${routeData.tempoTj}min`}</Time>
              </DistanceTime>
            </Instructions>
          </InstructionGroup>
        ))}
      </OpacityAnimation>
      )}

      {view === 'tickets' && (
        <OpacityAnimation delay={0.15}>
          {tickets.map((ticket) => (
            <TicketGroup key={`${ticket.codOperadora}${ticket.codVT}${ticket.qtdVt}${ticket.tipoTransp}`}>
              <IconContainer logo>
                <img src={ticket.linkOPLogo} alt="opLogo" className="noBg" />
              </IconContainer>

              <TicketInfo>
                <Title>
                  {ticket.qtdVt}
                  x
                  {' '}
                  {ticket.operadora}
                </Title>

                <TicketDescription>
                  {formatCurrency(ticket.tarifaVt)}
                  {' '}
                  -
                  {' '}
                  {ticket.tipoTransp}
                </TicketDescription>

                <TicketTotal>
                  Total de
                  {' '}
                  {formatCurrency(ticket.totVt)}
                </TicketTotal>
              </TicketInfo>
            </TicketGroup>
          ))}

          <TotalContainer>
            VT Total por dia
            {' '}
            {formatCurrency(totalVt)}
          </TotalContainer>
        </OpacityAnimation>
      )}
    </Container>
  );
}

Route.propTypes = {
  goingRoute: PropTypes.arrayOf(shape()).isRequired,
  returningRoute: PropTypes.arrayOf(shape()).isRequired,
  tickets: PropTypes.arrayOf(shape()).isRequired,
  view: PropTypes.string.isRequired,
};
