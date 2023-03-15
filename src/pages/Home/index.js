/* eslint-disable max-len */
import { ButtonsContainer, Container, FormCard } from './styles';

import Header from './components/Header';
import ProgressSteps from './components/ProgressSteps';
import Button from '../../components/Button';
import OpacityAnimation from '../../components/OpacityAnimation';
import PersonalInfoCard from './components/PersonalInfoCard';
import useHome from './useHome';
import AddressCard from './components/AddressCard';
import Transitions from '../../components/Transition';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import CompanySelectionCard from './components/CompanySelectionCard';
import WaitingCard from './components/WaitingCard';

export default function Home() {
  const {
    steps,
    activeStep,
    prevStep,
    nextStep,
    isVerifyingCpf,
    getErrorMessageByFieldName,
    cpf,
    handleCpfChange,
    name,
    handleNameChange,
    email,
    handleEmailChange,
    cep,
    streetName,
    district,
    city,
    uf,
    number,
    complement,
    handleNumberChange,
    handleComplementChange,
    handleCepChange,
    canAdvanceStep,
    isGettinCepData,
    isLoading,
    companyNotAllowed,
    logoSrc,
    workplaces,
    hasError,
    setSelectedWorkplace,
    selectedWorkplace,
    // setIsVerifyingCpf,
    hasCodEmpresaQuery,
    calculateRoute,
    // errorAtResultGeneration,
    // consultExpired,
    consultCode,
  } = useHome();

  const hasWorkplaces = workplaces.length !== 0;

  const isFormSuccessfullyLoaded = (!isLoading && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && !hasError);

  return (
    <Transitions>
      <Loader isLoading={isLoading} />

      <Container>
        <Header logoSrc={logoSrc} />
        {isFormSuccessfullyLoaded && (
          <>
            <ProgressSteps steps={steps} activeStep={activeStep} />

            <FormCard>
              {activeStep === 1 && (
              <OpacityAnimation>
                <PersonalInfoCard
                  isVerifyingCpf={isVerifyingCpf}
                  getErrorMessageByFieldName={getErrorMessageByFieldName}
                  cpf={cpf}
                  handleCpfChange={handleCpfChange}
                  name={name}
                  handleNameChange={handleNameChange}
                  email={email}
                  handleEmailChange={handleEmailChange}
                  cep={cep}
                  handleCepChange={handleCepChange}
                  isGettinCepData={isGettinCepData}
                />
              </OpacityAnimation>
              )}

              {activeStep === 2 && (
              <OpacityAnimation>
                <AddressCard
                  streetName={streetName}
                  district={district}
                  city={city}
                  uf={uf}
                  cep={cep}
                  isGettinCepData={isGettinCepData}
                  number={number}
                  complement={complement}
                  handleNumberChange={handleNumberChange}
                  handleComplementChange={handleComplementChange}
                  handleCepChange={handleCepChange}
                  getErrorMessageByFieldName={getErrorMessageByFieldName}
                />
              </OpacityAnimation>
              )}

              {activeStep === 3 && (
              <OpacityAnimation>
                <CompanySelectionCard
                  setSelectedWorkplace={setSelectedWorkplace}
                  selectedWorkplace={selectedWorkplace}
                  workplaces={workplaces}
                />
              </OpacityAnimation>
              )}

              {activeStep === 4 && (
                <OpacityAnimation>
                  <WaitingCard consultCode={consultCode} />
                </OpacityAnimation>
              )}

              {activeStep !== 4 && (
              <ButtonsContainer>
                {activeStep !== 1 && (
                <OpacityAnimation>
                  <Button onClick={prevStep}>
                    Voltar
                  </Button>
                </OpacityAnimation>
                )}
                <OpacityAnimation>
                  <Button
                    onClick={activeStep === 3 ? calculateRoute : nextStep}
                    disabled={!canAdvanceStep}
                  >
                    {activeStep === 3 ? 'Roteirizar' : 'Próximo'}
                  </Button>
                </OpacityAnimation>
              </ButtonsContainer>
              )}
            </FormCard>
          </>
        )}
      </Container>

      {companyNotAllowed && !isLoading && hasCodEmpresaQuery && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! Parece que sua empresa não está com o serviço habilitado.
              Verifique se já foi realizada a solicitação desse serviço, e caso positivo, peça para que seu RH entre em contao com a nossa central de atendimento por WhatsApp!.
              {' '}
              <a href="https://wa.me/5512997322708">(12)99732-2708</a>
              {' '}
              /
              {' '}
              <a href="https://wa.me/5511991650055">(11)99165-0055</a>
            </>
)}
        />
      )}

      {!hasCodEmpresaQuery && !isLoading && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! A URL que você acessou está inválida, pois não conseguimos identificar a empresa através da mesma. Por favor, solicite um novo Link.
            </>
)}
        />
      )}

      {!hasWorkplaces && !isLoading && !companyNotAllowed && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! A sua empresa ainda não cadastrou os locais de trabalho para o funcionamento deste serviço. Por favor, peça para que seu RH entre em contao com a nossa central de atendimento por WhatsApp!.
            </>
)}
        />
      )}

      {hasError && !isLoading && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! Tivemos um problema ao carregar a página. Por favor, tente atualizá-la.
            </>
)}
        />
      )}
    </Transitions>
  );
}