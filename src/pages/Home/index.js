/* eslint-disable max-len */
// import { Link } from 'react-router-dom';
import { ButtonsContainer, Container, FormCard } from './styles';

import Button from '../../components/Button';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import OpacityAnimation from '../../components/OpacityAnimation';
import Transitions from '../../components/Transition';
import AddressCard from './components/AddressCard';
import CompanySelectionCard from './components/CompanySelectionCard';
import Header from './components/Header';
import HighSalaryCard from './components/HighSalaryCard';
import PersonalInfoCard from './components/PersonalInfoCard';
import ProgressSteps from './components/ProgressSteps';
import WaitingCard from './components/WaitingCard';
import useHome from './useHome';

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
    hasCodEmpresaQuery,
    calculateRoute,
    errorAtResultGeneration,
    consultExpired,
    consultCode,
    isSendingData,
    isManualFill,
    handleStreetnameChange,
    handleDistrictChange,
    // codEmpresa,
    mustSendAddressProof,
    addressProof,
    setAddressProof,
    isUfRj,
    isHighSalary,
    setIsHighSalary,
    mustVerifyIsRj,
    workplacesOptions,
  } = useHome();

  const hasWorkplaces = workplaces.length !== 0 && !isLoading;

  const isFormSuccessfullyLoaded = (!isLoading && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && !hasError && !errorAtResultGeneration && !consultExpired);

  const invalidUrl = !hasCodEmpresaQuery && !isLoading && !errorAtResultGeneration && !consultExpired;

  const workplacesNotFound = !hasWorkplaces && !isLoading && !companyNotAllowed && !errorAtResultGeneration && !consultExpired;

  const unexpectedError = hasError && !isLoading && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && !errorAtResultGeneration && !consultExpired;

  const resultNotFound = !isLoading && !hasError && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && errorAtResultGeneration && !consultExpired;

  const consultExpire = !isLoading && !hasError && !companyNotAllowed && hasCodEmpresaQuery && hasWorkplaces && !errorAtResultGeneration && consultExpired;

  // const isCompanyKonecta = codEmpresa == 43769;

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
                  isManualFill={isManualFill}
                  handleStreetnameChange={handleStreetnameChange}
                  handleDistrictChange={handleDistrictChange}
                  getErrorMessageByFieldName={getErrorMessageByFieldName}
                  mustSendAddressProof={mustSendAddressProof}
                  addressProof={addressProof}
                  setAddressProof={setAddressProof}
                />
              </OpacityAnimation>
              )}

              {(isUfRj && mustVerifyIsRj) ? (
                <>
                  {activeStep === 3 && (
                  <OpacityAnimation>
                    <HighSalaryCard
                      isHighSalary={isHighSalary}
                      setIsHighSalary={setIsHighSalary}
                    />
                  </OpacityAnimation>
                  )}

                  {activeStep === 4 && (
                    <OpacityAnimation>
                      <CompanySelectionCard
                        setSelectedWorkplace={setSelectedWorkplace}
                        selectedWorkplace={selectedWorkplace}
                        workplaces={workplacesOptions}
                      />
                    </OpacityAnimation>
                  )}

                  {activeStep === 5 && (
                  <OpacityAnimation>
                    <WaitingCard consultCode={consultCode} />
                  </OpacityAnimation>
                  )}

                  {activeStep !== 5 && (
                  <ButtonsContainer>
                    {activeStep !== 1 && (
                    <OpacityAnimation>
                      <Button onClick={prevStep} disabled={(activeStep === 3 && isSendingData)}>
                        Voltar
                      </Button>
                    </OpacityAnimation>
                    )}
                    <OpacityAnimation>
                      <Button
                        onClick={activeStep === 4 ? calculateRoute : nextStep}
                        disabled={(!canAdvanceStep || (activeStep === 4 && isSendingData))}
                      >
                        {activeStep === 4 ? 'Roteirizar' : 'Próximo'}
                      </Button>
                    </OpacityAnimation>
                  </ButtonsContainer>
                  )}
                </>
              ) : (
                <>
                  {activeStep === 3 && (
                  <OpacityAnimation>
                    <CompanySelectionCard
                      setSelectedWorkplace={setSelectedWorkplace}
                      selectedWorkplace={selectedWorkplace}
                      workplaces={workplacesOptions}
                      isUfRj={isUfRj}
                      isHighSalary={isHighSalary}
                      setIsHighSalary={setIsHighSalary}
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
                      <Button onClick={prevStep} disabled={(activeStep === 3 && isSendingData)}>
                        Voltar
                      </Button>
                    </OpacityAnimation>
                    )}
                    <OpacityAnimation>
                      <Button
                        onClick={activeStep === 3 ? calculateRoute : nextStep}
                        disabled={(!canAdvanceStep || (activeStep === 3 && isSendingData))}
                      >
                        {activeStep === 3 ? 'Roteirizar' : 'Próximo'}
                      </Button>
                    </OpacityAnimation>
                  </ButtonsContainer>
                  )}
                </>
              )}

            </FormCard>

            {activeStep === 3 && isUfRj && mustVerifyIsRj && (
            <a href="https://site.riobilheteunico.com.br/novas-regras-do-bilhete-unico-intermunicipal/" className="infoLink" target="_blank" rel="noopener noreferrer">
              Acesse aqui mais detalhes sobre a regra da Riocard referente ao salário.
            </a>
            )}
          </>
        )}
      </Container>

      {companyNotAllowed && !isLoading && hasCodEmpresaQuery && !errorAtResultGeneration && !consultExpired && (
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

      {invalidUrl && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! A URL que você acessou está inválida, pois não conseguimos identificar a empresa através da mesma. Por favor, solicite um novo Link.
            </>
)}
        />
      )}

      {workplacesNotFound && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! A sua empresa ainda não cadastrou os locais de trabalho para o funcionamento deste serviço. Por favor, peça para que seu RH entre em contao com a nossa central de atendimento por WhatsApp!.
            </>
)}
        />
      )}

      {unexpectedError && (
        <NoData
          icon="sad"
          label={(
            <>
              Ops! Tivemos um problema ao carregar a página. Por favor, tente atualizá-la.
            </>
)}
        />
      )}

      {resultNotFound && (
        <NoData
          icon="sad"
          label={(
            <>
              Não conseguimos encontrar um resultado, mas não se preocupe! Dentro das próximas 2 horas enviaremos um e-mail com o resultado para você!
              Se acaso não receber, envie uma mensagem para nosso
              <a href="https://wa.me/5511991650055?text=Ol%C3%A1%21+Tudo+bem%3F+Meu+resultado+do+My-Link+n%C3%A3o+apresentou+resultado+e+ainda+n%C3%A3o+tive+nenhum+retorno+por+e-mail"> WhatsApp </a>

              {/* <br />

              <strong>Dica:</strong>
              {' '}
              Antes de enviar a carta, baixe e salve-a em seu smartphone ou computador e depois abra este documento para preencher e assinar pelo seu navegador ou pelo ADOBE ACROBAT!
              Isso é mais simples!

              <br />

              {!isCompanyKonecta && (
                <Link to="/files/Modelo de Carta de Opcao de VT fora abrangencia - CAPTA MOBILIDADE.pdf" target="_blank" download>
                  Baixar Carta
                </Link>
              )} */}
            </>
)}
        />
      )}

      {consultExpire && (
      <NoData
        icon="sad"
        label={(
          <>
            Essa consulta já expirou.

            Por favor, verifique se você não possui uma consulta mais recente, ou gere uma nova!
          </>
)}
      />
      )}
    </Transitions>
  );
}
