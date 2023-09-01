/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import SignatureCanvas from 'react-signature-canvas';

import Button from '../../components/Button';
import Loader from '../../components/Loader';
import MyModal from '../../components/Modal';
import NoData from '../../components/NoData';
import Textarea from '../../components/Textarea';
import Transitions from '../../components/Transition';
import formatCurrency from '../../utils/formatCurrency';
import ConsultCard from './components/ConsultCard';
import DistanceCard from './components/DistanceCard';
import PriceCard from './components/PriceCard';
import CaptaHeader from '../../components/Header';
import SidebarRoute from './components/SidebarRoute';
import { IconContainer } from './components/SidebarRoute/components/Route/styles';
import Timecard from './components/TimeCard';
import {
  AcceptContainer,
  AcceptModalContainer,
  Actions,
  Container,
  Display,
  Header,
  MapContainer,
  RefuseModalContainer,
  SingatureContainer,
  TicketDescription,
  TicketGroup,
  TicketInfo,
  TicketTotal,
  Title,
  TotalContainer,
} from './styles';
import useResult from './useResult';
import { domain } from '../../enviromentVariables';

export default function Result() {
  const {
    isLoading,
    goingRoute,
    returningRoute,
    tickets,
    view,
    setView,
    logo,
    hasError,
    exceededPrice,
    totalPrice,
    resultStatus,
    allowPdfDownload,
    handleTryAgain,
    consultCode,
    adjustmentReason,
    handleAdjustmentReasonChange,
    setAdjustmentModalShow,
    requestAdjustment,
    adjustmentModalShow,
    isSomeActionLoading,
    setRefuseModalShow,
    acceptModalShow,
    setAcceptModalShow,
    refuseModalShow,
    handleResultAction,
    remainingAdjustmentChars,
    isRefuseButtonDisabled,
    setIsRefuseButtonDisabled,
    isAcceptButtonDisabled,
    setIsAcceptButtonDisabled,
    isBkConsultAndNotOptimized,
  } = useResult();

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [acceptCanvas, setAcceptCanvas] = useState(null);
  const [refuseCanvas, setRefuseCanvas] = useState(null);

  const sigCanvas = useRef(null);
  const sigRefuseCanvas = useRef(null);

  const standardRender = (resultStatus === 'nothingDone' || resultStatus === 'answered') && allowPdfDownload && !exceededPrice;
  const standardRenderBlockPdf = (resultStatus === 'nothingDone' || resultStatus === 'answered') && !allowPdfDownload && !exceededPrice;

  const downloadPdfRender = (resultStatus === 'accepted' || resultStatus === 'refused') && allowPdfDownload && !exceededPrice;

  const totalVt = tickets.reduce((acc, cur) => (
    acc + cur.totVt
  ), 0);

  // eslint-disable-next-line max-len
  // const anyButtonToRender = (((resultStatus === 'accepted' || resultStatus === 'refused') && !allowPdfDownload) || resultStatus === 'waitingAnswer' || exceededPrice);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Transitions>
      <Loader isLoading={isLoading || isSomeActionLoading} />
      {!hasError && !isLoading && !isBkConsultAndNotOptimized && !exceededPrice && (
        <Container>
          <SidebarRoute
            setView={setView}
            goingRoute={goingRoute}
            returningRoute={returningRoute}
            tickets={tickets}
            view={view}
            logo={logo}
          />

          <Display>
            <Header>
              <ConsultCard consultCode={consultCode} />
              <PriceCard totalPrice={totalPrice} />
              <DistanceCard walkDistance={goingRoute[0].distanciaTj} />
              <Timecard walkTime={goingRoute[0].tempoTj} />
            </Header>

            {(standardRender || standardRenderBlockPdf) && (
              <Actions>
                <Button background="#428bca" onClick={() => setAdjustmentModalShow(true)}>
                  Solicitar Ajuste
                </Button>
                <Button background="#5cb85c" onClick={() => setAcceptModalShow(true)}>
                  Aceitar
                </Button>
                <Button background="#d9534f" onClick={() => setRefuseModalShow(true)}>
                  Não desejo VT
                </Button>
              </Actions>
            )}

            {downloadPdfRender && !isBkConsultAndNotOptimized && (
              <Actions>
                <a href={`https://rels${domain}/GeradorCarta?Consulta=${consultCode}`} download target="_blank" rel="noreferrer">
                  <Button background="#428bca">Baixar Carta</Button>
                </a>
                {resultStatus === 'accepted' && (
                  <Button background="#d9534f" onClick={() => setRefuseModalShow(true)}>
                    Cancelar VT
                  </Button>
                )}
              </Actions>
            )}

          </Display>

          <MyModal
            title="Solicitar Ajuste"
            closeButtonLabel="Cancelar"
            actionButtonLabel="Enviar Solicitação"
            modalBody={(
              <>
                <h6>Descreva abaixo o motivo da sua solicitação de ajuste (máx. 300 caracteres)</h6>
                <Textarea
                  value={adjustmentReason}
                  placeholder="Explique aqui qual seria a rota ideal para você para que ajustemos"
                  onChange={handleAdjustmentReasonChange}
                />
                <small>
                  {remainingAdjustmentChars}
                  {' '}
                  Caracteres restantes
                </small>
              </>
          )}
            onClose={() => setAdjustmentModalShow(false)}
            onAction={() => requestAdjustment()}
            isActionButtonDisabled={!adjustmentReason}
            show={adjustmentModalShow}
            type="suspendAction"
          />

          <MyModal
            title="Não optar pelo VT"
            closeButtonLabel="Cancelar"
            actionButtonLabel="Confirmar recusa do VT"
            modalBody={(
              <RefuseModalContainer>
                <div>
                  Caso prefira não optar pelo benefício do vale-transporte, basta assinar e clicar no botão
                  {' '}
                  <strong>Confirmar recusa do VT</strong>
                  {' '}
                  logo abaixo!
                </div>

                <SingatureContainer>
                  <span>Assine aqui</span>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                    ref={sigRefuseCanvas}
                    onEnd={() => {
                      setIsRefuseButtonDisabled(false);
                      setRefuseCanvas(sigRefuseCanvas.current?.getTrimmedCanvas());
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sigRefuseCanvas.current.clear();
                      setIsRefuseButtonDisabled(true);
                    }}
                  >
                    Refazer
                  </button>
                </SingatureContainer>
              </RefuseModalContainer>
          )}
            onClose={() => { setRefuseModalShow(false); setIsRefuseButtonDisabled(true); }}
            onAction={() => handleResultAction('refuse', refuseCanvas)}
            isActionButtonDisabled={isRefuseButtonDisabled}
            show={refuseModalShow}
            type="deleteAction"
          />

          <MyModal
            title="Assine e revise seus bilhetes"
            closeButtonLabel="Cancelar"
            actionButtonLabel="Confirmar Resultado"
            size="lg"
            modalBody={(
              <AcceptModalContainer>
                <AcceptContainer>
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
                </AcceptContainer>

                <SingatureContainer>
                  <span>Assine aqui</span>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                    ref={sigCanvas}
                    onEnd={() => {
                      setIsAcceptButtonDisabled(false);
                      setAcceptCanvas(sigCanvas.current?.getTrimmedCanvas());
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sigCanvas.current.clear();
                      setIsAcceptButtonDisabled(true);
                    }}
                  >
                    Refazer
                  </button>
                </SingatureContainer>

              </AcceptModalContainer>
          )}
            onClose={() => { setAcceptModalShow(false); setIsAcceptButtonDisabled(true); }}
            onAction={() => handleResultAction('accept', acceptCanvas)}
            isActionButtonDisabled={isAcceptButtonDisabled}
            show={acceptModalShow}
            type="activateAction"
          />

          <MapContainer>
            <iframe
              title="Mapa"
              src={`https://mapas${domain}/home/index?consulta=${consultCode}&sentido=1&rota=1&trajeto=1&h=${height}&w=${width}&z=12`}
              width={width}
              height={height}
              marginWidth={0}
              marginHeight={0}
            />
          </MapContainer>

        </Container>
      )}

      {!hasError && !isLoading && isBkConsultAndNotOptimized && (
        <>
          <CaptaHeader />
          <NoData
            icon="ok"
            label={(
              <>
                Percebemos que o vale-transporte que utiliza atualmente não sofrerá alterações.
                Está tudo OK!
                Obrigado!
              </>
)}
          />
        </>
      )}

      {!hasError && !isLoading && exceededPrice && (
      <>
        <CaptaHeader />
        <NoData
          icon="sad"
          label={(
            <>
              Ocorreu uma inconscistência.
              Por favor, procure o RH de sua empresa para mais informações.
            </>
)}
        />
      </>
      )}

      {hasError && !isLoading && (
        <>
          <CaptaHeader />
          <NoData
            icon="sad"
            label={(
              <>
                Ocorreu um erro ao recuperar seu resultado.
                <button type="button" onClick={handleTryAgain}>Tentar Novamente</button>
              </>
)}
          />
        </>
      )}
    </Transitions>
  );
}
