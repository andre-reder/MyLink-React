/* eslint-disable max-len */
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/auth';
import useErrors from '../../hooks/useErrors';
import { useQuery } from '../../hooks/useQuery';
import homeService from '../../services/homeService';
import formatCep from '../../utils/formatCep';
import formatCpf from '../../utils/formatCpf';
import formatPhone from '../../utils/formatPhone';
import isCpfvalid from '../../utils/isCpfValid';
import isEmailValid from '../../utils/isEmailValid';
import onlyNumbers from '../../utils/onlyNumbers';
import sendLinkWhatsapp from '../../utils/sendLinkWhatsapp';

export default function useHome() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');

  const [cep, setCep] = useState('');
  const [streetName, setStreetName] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [isManualFill, setIsManualFill] = useState(false);
  const [isUfRj, setIsUfRj] = useState(false);
  const [isHighSalary, setIsHighSalary] = useState(false);

  const [consultCode, setConsultCode] = useState('');
  const [employeeCodeSt, setEmployeeCode] = useState('');

  const [workplaces, setWorkplaces] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState({});

  const [isVerifyingCpf, setIsVerifyingCpf] = useState(false);
  const [isGettinCepData, setIsGettingCepData] = useState(false);

  const [intervalId, setIntervalId] = useState(null);

  const [companyNotAllowed, setCompanyNotAllowed] = useState(true);
  const [errorAtResultGeneration, setErrorAtResultGeneration] = useState(false);
  const [consultExpired, setConsultExpired] = useState(false);

  const [currentCep, setCurrentCep] = useState(null);
  const [mustSendAddressProof, setMustSendAddressProof] = useState(false);
  const [addressProof, setAddressProof] = useState('');
  const [mustVerifyIsRj, setMustVerifyIsRj] = useState(false);

  const [sentEmail, setSentEmail] = useState(false);
  const [sentWhatsapp, setSentWhatsapp] = useState(false);

  const [isMyLinkFull, setIsMyLinkFull] = useState(true);
  const [linkToResult, setLinkToResult] = useState('');

  const workplacesOptions = useMemo(() => {
    if (workplaces.length === 0) return [];

    const exceptions = [['GO', 'DF'], ['MA', 'PI'], ['PE', 'BA']];
    const exceptioGroupOFUf = exceptions.find((exception) => exception.includes(uf));

    const filteredWorkplaces = workplaces.filter((wp) => {
      if (!uf) return true;

      if (!exceptioGroupOFUf) {
        return wp.uf === uf;
      }

      return exceptioGroupOFUf.includes(wp.uf);
    });

    if (filteredWorkplaces.length === 0 && !!uf) {
      toast.warn('Não há nenhum local de trabalho na mesma UF do CEP informado. Por favor, verifique se inseriu o seu CEP corretamente', { toastId: 'noWorkplaces' });
    }

    return filteredWorkplaces;
  }, [uf, workplaces]);

  const {
    setError, removeError, getErrorMessageByFieldName, errors,
  } = useErrors();

  const navigate = useNavigate();
  const { token } = useAppContext();

  const query = useQuery();
  const codEmpresa = query.get('codEmpresa');
  const hasCodEmpresaQuery = query.has('codEmpresa');
  // const hasEmployeeCodeQuery = query.has('codFuncionario');
  const hasConsultCodeQuery = query.has('codConsulta');
  const employeeCodeQuery = query.get('codFuncionario');
  const consultCodeQuery = query.get('codConsulta');

  const isFirstStepValid = (cpf && name && email && cellphone && !errors.some((err) => (
    err.field === 'name' || err.field === 'cpf' || err.field === 'email'
  )));

  const isSecondStepValid = (cep && streetName && number && district && city && uf && workplacesOptions.length !== 0 && !errors.some((err) => (
    err.field === 'cep'
  )) && ((!!addressProof && mustSendAddressProof) || !currentCep || !mustSendAddressProof));

  const isThirdStepValid = (selectedWorkplace.value && errors.length === 0);

  const stepsValidationMap = useMemo(() => (
    (isUfRj && mustVerifyIsRj) ? {
      1: isFirstStepValid,
      2: isSecondStepValid,
      3: true,
      4: isThirdStepValid,
    } : {
      1: isFirstStepValid,
      2: isSecondStepValid,
      3: isThirdStepValid,
    }
  ), [isFirstStepValid, isSecondStepValid, isThirdStepValid, isUfRj, mustVerifyIsRj]);

  const canAdvanceStep = stepsValidationMap[activeStep];

  const steps = useMemo(() => (
    !(isUfRj && mustVerifyIsRj) ? [
      {
        label: 'Dados Pessoais',
        step: 1,
      },
      {
        label: 'Endereço',
        step: 2,
      },
      {
        label: 'Local de trabalho',
        step: 3,
      },
      {
        label: 'Aguarde',
        step: 4,
      },
    ] : [
      {
        label: 'Dados',
        step: 1,
      },
      {
        label: 'Residência',
        step: 2,
      },
      {
        label: 'Salário',
        step: 3,
      },
      {
        label: 'Trabalho',
        step: 4,
      },
      {
        label: 'Aguarde',
        step: 5,
      },
    ]
  ), [isUfRj, mustVerifyIsRj]);

  const toastStatusId = useRef(null);

  function handleNameChange(event) {
    setName(event.target.value);
    if (!event.target.value) {
      setError({ field: 'name', message: 'Nome é obrigatório!' });
    } else {
      removeError('name');
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (!event.target.value || !isEmailValid(event.target.value)) {
      setError({ field: 'email', message: 'Informe um e-mail válido!' });
    } else {
      removeError('email');
    }
  }

  function handleCellphoneChange(event) {
    setCellphone(formatPhone(event.target.value));
    if (!event.target.value || event.target.value.length < 14) {
      setError({ field: 'cellphone', message: 'Informe um celular válido!' });
    } else {
      removeError('cellphone');
    }
  }

  function handleNumberChange(event) {
    setNumber(onlyNumbers(event.target.value));
    if (!event.target.value) {
      setError({ field: 'number', message: 'Número é obrigatório!' });
    } else {
      removeError('number');
    }
  }

  function handleComplementChange(event) {
    setComplement(event.target.value);
  }

  function handleStreetnameChange(event) {
    setStreetName(event.target.value);
    if (!event.target.value) {
      setError({ field: 'streetname', message: 'Logradouro é obrigatório!' });
    } else {
      removeError('streetname');
    }
  }

  function handleDistrictChange(event) {
    setDistrict(event.target.value);
    if (!event.target.value) {
      setError({ field: 'district', message: 'Bairro é obrigatório!' });
    } else {
      removeError('district');
    }
  }

  const nextStep = useCallback(() => {
    setActiveStep((prevState) => {
      if (prevState + 1 === 3 && isUfRj && mustVerifyIsRj) {
        toast.warn('Identificamos que sua residência fica no estado do RJ, portanto, precisamos saber se seu salário é maior que R$ 3.205,20 para atribuir corretamente os valores de sua consulta por conta da regra de integração que funciona de forma diferente dependendo deste critério', { toastId: 'isUfRj' });
      }

      if (prevState === 1) {
        toast.info('Enviaremos o link para acesso ao resultado no WhatsApp informado através do contato CAPTA MOBILIDADE.', { toastId: 'sendLink' });
      }
      return prevState + 1;
    });
  }, [isUfRj, mustVerifyIsRj]);

  const prevStep = () => {
    setActiveStep((prevState) => prevState - 1);
  };

  const handleCepChange = useCallback(async (event) => {
    try {
      setCep(formatCep(event.target.value));
      if (!event.target.value) {
        setError({ field: 'cep', message: 'CEP é obrigatório!' });
      }
      if (formatCep(event.target.value).length === 9) {
        setIsGettingCepData(true);
        setIsManualFill(false);
        const response = await fetch(`https://viacep.com.br/ws/${event.target.value}/json/`);
        const cepInfo = await response.json();
        if (cepInfo.erro) {
          setError({ field: 'cep', message: 'CEP inválido!' });
          setCep('');
          setStreetName('');
          setDistrict('');
          setCity('');
          setUf('');
          setIsGettingCepData(false);
          toast.error('CEP não encontrado');
          return;
        }
        setStreetName(cepInfo.logradouro);
        setDistrict(cepInfo.bairro);
        setCity(cepInfo.localidade);
        setUf(cepInfo.uf);

        setIsUfRj(cepInfo.uf === 'RJ' && mustVerifyIsRj);

        if (!cepInfo.bairro || !cepInfo.logradouro) {
          setIsManualFill(true);
          setStreetName('');
          setDistrict('');
          toast.warn('Insira manualmente o nome do bairro e do logradouro, pois o CEP fornecido abrange toda a cidade. Certifique-se de digitar corretamente para evitar erros.');
        }
        setIsGettingCepData(false);
      }
      if (formatCep(event.target.value).length !== 9) {
        setError({ field: 'cep', message: 'CEP inválido!' });
        setStreetName('');
        setDistrict('');
        setCity('');
        setUf('');
        setIsGettingCepData(false);
        return;
      }
      removeError('cep');
      setIsGettingCepData(false);

      if (!!currentCep && currentCep !== formatCep(event.target.value)) {
        setMustSendAddressProof(true);
        toast.warn('Identificamos que seu CEP foi alterado. Por favor, envie seu comprovante de residência atualizado para prosseguir, ou verifique se digitou seu CEP corretamente');
      } else {
        setMustSendAddressProof(false);
      }
    } catch (error) {
      toast.error(`Ocorreu um erro ao buscar o CEP (${error})`);
      setIsGettingCepData(false);
    }
  }, [currentCep, mustVerifyIsRj, removeError, setError]);

  const handleCpfChange = useCallback(async (event) => {
    try {
      setCpf(formatCpf(event.target.value));
      if (!event.target.value || !isCpfvalid(formatCpf(event.target.value))) {
        setError({ field: 'cpf', message: 'CPF Inválido!' });
        return;
      }
      if (formatCpf(event.target.value).length === 14) {
        setIsVerifyingCpf(true);
        const bodyCheckCpf = await homeService.checkCpf({
          codEmpresa,
          cpf: formatCpf(event.target.value),
          token,
        });
        setCurrentCep(bodyCheckCpf.cepAtual);
        setMustVerifyIsRj(bodyCheckCpf.regraSemIntegraRJ);
        if (!bodyCheckCpf.liberado) {
          setError({ field: 'cpf', message: 'Este CPF já foi utilizado!' });
          setIsVerifyingCpf(false);
          toast.error('Verificamos que já existe um resultado gerado para o CPF informado. Para acessar seu resultado, verifique seu e-mail');
          return;
        }
        setIsVerifyingCpf(false);
      }
      removeError('cpf');
      setIsVerifyingCpf(false);
    } catch (error) {
      toast.error(`Ocorreu um erro ao validar o CPF (${error})`);
      setIsVerifyingCpf(false);
    }
  }, [codEmpresa, removeError, setError, token]);

  const checkIsCompanyHabilitated = useCallback(async () => {
    try {
      const isCompanyHabilitated = await homeService.checkIsCompanyHabilitated({
        codEmpresa,
        token,
      });
      if (!isCompanyHabilitated.codigo) {
        toast.error(isCompanyHabilitated.msg);
        setCompanyNotAllowed(true);
        return;
      }
      if (isCompanyHabilitated.trocaLogo) {
        setLogoSrc(isCompanyHabilitated.linkLogo);
      }
      setIsMyLinkFull(isCompanyHabilitated.usaMyLinkFull);
      setCompanyNotAllowed(false);
      toast.success('Olá! Seja bem-vindo ao My-Link. Aqui você realizará sua roteirização de Vale Transporte.', {
        icon: '👋',
        toastId: 'welcomeToast',
      });
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`, { toastId: 'companyNotAllowed' });
      setHasError(true);
    }
  }, [codEmpresa, token]);

  const getWorkplaces = useCallback(async () => {
    try {
      const workplacesList = await homeService.getWorkplacesList({
        codEmpresa,
        token,
      });
      if (!workplacesList.codigo) {
        toast.error(workplacesList.msg);
        setHasError(true);
        return;
      }
      const workplacesListMapped = workplacesList.locaisTrabalho.map((wp) => ({
        label: wp.localTrabalho || 'Sem descrição',
        value: wp.codEndCliente,
        address: `${wp.logradouroLt}, ${wp.numLt}, ${wp.bairroLt} - ${wp.cidadeLt} ${wp.ufLt}`,
        uf: wp.ufLt,
      }));
      setWorkplaces(workplacesListMapped);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    }
  }, [codEmpresa, token]);

  const checkResultStatus = useCallback(async (consult, employee) => {
    try {
      if (errorAtResultGeneration || consultExpired) {
        clearInterval(intervalId);
        return;
      }
      const status = await homeService.checkResulStatus({
        codConsulta: consult,
        token,
      });
      if (!status.codigo) {
        toast.info(`Não conseguimos recuperar o status de processamento da sua consulta (${status.msg})`);
      }
      // console.log(status);
      const statusMapActions = {
        0: () => toast.update(toastStatusId.current, {
          render: 'Sua consulta foi gerada e está aguardando seu processamento ser iniciado',
          icon: '🕓',
          type: toast.TYPE.INFO,
          autoClose: false,
        }),
        1: () => toast.update(toastStatusId.current, {
          render: 'Sua consulta está sendo processada, e em alguns segundos o seu resultado será gerado!',
          icon: '🚌',
          type: toast.TYPE.INFO,
          autoClose: false,
        }),
        2: () => {
          toast.dismiss(toastStatusId.current);
          navigate(`/resultado?codFuncionario=${employee}&codConsulta=${consult}&logo=${logoSrc || false}`);
        },
        3: () => {
          // console.log('ACIONOU O 3');
          setErrorAtResultGeneration(true);
          clearInterval(intervalId);
          toast.dismiss(toastStatusId.current);
          setLinkToResult(`/resultado?codFuncionario=${employee}&codConsulta=${consult}&logo=${logoSrc || false}`);

          if (isMyLinkFull) {
            toast.warn('Não conseguimos encontrar nenhuma opção de vale-transporte para a sua região. Por favor, insira os bilhetes que você utiliza, na ordem correta, para que seja possível prosseguir com a roteirização.', { toastId: 'noVtOptions', autoClose: false });
          }
        },
        4: () => {
          setConsultExpired(true);
          clearInterval(intervalId);
          toast.dismiss(toastStatusId.current);
        },
      };
      statusMapActions[status.statusProcessamento.codSta]();
    } catch (error) {
      toast.error(`Não conseguimos checar o status de processamento do seu resultado (${error})`);
    }
  }, [consultExpired, errorAtResultGeneration, intervalId, isMyLinkFull, logoSrc, navigate, token]);

  const startResultStatusInterval = useCallback((consult, employee) => {
    checkResultStatus(consult, employee);
    const id = setInterval(() => {
      checkResultStatus(consult, employee);
    }, 5000);
    setIntervalId(id);
  }, [checkResultStatus]);

  const loadHome = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        checkIsCompanyHabilitated(),
        getWorkplaces(),
      ]);
      if (hasCodEmpresaQuery && hasConsultCodeQuery && hasConsultCodeQuery && !intervalId) {
        setActiveStep(4);
        startResultStatusInterval(consultCodeQuery, employeeCodeQuery);
      }
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [checkIsCompanyHabilitated, consultCodeQuery, employeeCodeQuery, getWorkplaces, hasCodEmpresaQuery, hasConsultCodeQuery, intervalId, startResultStatusInterval]);

  const calculateRoute = useCallback(async () => {
    try {
      setIsSendingData(true);
      const strNum = cellphone.replace(/[^\d]+/g, '');
      const bodySentToCalculate = await toast.promise(homeService.calculateRoute({
        codEmpresa,
        codLocTrab: selectedWorkplace.value,
        semIntregraRJ: !!(isUfRj && mustVerifyIsRj && isHighSalary),
        token,
        reqBody: JSON.stringify({
          cpf,
          nome: name,
          email,
          cepF: cep,
          logradouroF: streetName,
          numF: Number(number),
          complementoF: complement,
          bairroF: district,
          cidadeF: city,
          ufF: uf,
          celularFunc: `+55${strNum}`,
        }),
      }), {
        pending: 'Estamos enviando seus dados para a roteirização.',
        success: 'Seus dados foram enviados com sucesso!',
        error: 'Não foi possível enviar seus dados para a roteirização',
      });

      const hasBeenSentSuccessfully = bodySentToCalculate.codigo;
      if (!hasBeenSentSuccessfully) {
        toast.error(`Houve um erro ao enviar seus dados para roteirização. Por favor, tente novamente ${bodySentToCalculate.msg}`);
        // prevStep();
        return;
      }

      const resultLink = bodySentToCalculate.linkResultado;
      const hasEmailBeenSent = bodySentToCalculate.enviouEmail;
      const imgUrl = bodySentToCalculate.linkLogo;
      const companyName = bodySentToCalculate.nomeEmpresa;
      const hasWhatsappBeenSent = await sendLinkWhatsapp({
        phone: cellphone,
        message: `👋 Olá, ${name}!\n\nVocê é funcionário da empresa *${companyName}*?\n\n🚌 Acesse o link abaixo para visualizar o resultado da sua roteirização, e prosseguir com o seu processo.\n\nCaso não consiga clicar no link, responda a essa mensagem, ou nos adicione em sua lista de contatos.\n\n${resultLink}`,
        image: imgUrl,
        linkUrl: resultLink,
        title: 'Resultado da roteirização',
        linkDescription: 'Clique aqui para acessar o resultado da sua roteirização de itinerário de Vale-Transporte!',
        companyName,
        contactName: name,
      });

      setSentEmail(hasEmailBeenSent);
      setSentWhatsapp(hasWhatsappBeenSent.success);

      toastStatusId.current = toast('Só mais um pouco! Vamos atualizar aqui pra você o status do processamento do seu resultado.', {
        autoClose: false,
        icon: '😁',
      });
      const employeeCode = bodySentToCalculate.codFuncionario;
      if (mustSendAddressProof) {
        const bodySendAddressProof = await homeService.sendAddressProof({
          codFuncionario: employeeCode,
          reqBody: [{ key: 'file', value: addressProof }],
        });
        if (!bodySendAddressProof.codigo) {
          toast.warn(`Não foi possível enviar seu comprovante, mas não se preocupe! O seu resultado continua sendo gerado normalmente. (${bodySendAddressProof.msg})`);
        }
      }
      nextStep();
      setConsultCode(bodySentToCalculate.codConsulta);
      setEmployeeCode(bodySentToCalculate.codFuncionario);
      startResultStatusInterval(bodySentToCalculate.codConsulta, bodySentToCalculate.codFuncionario);
    } catch (error) {
      toast.error(`Houve um erro ao enviar seus dados para roteirização. Por favor, tente novamente ${error}`);
      prevStep();
    } finally {
      setIsSendingData(false);
    }
  }, [addressProof, cellphone, cep, city, codEmpresa, complement, cpf, district, email, isHighSalary, isUfRj, mustSendAddressProof, mustVerifyIsRj, name, nextStep, number, selectedWorkplace.value, startResultStatusInterval, streetName, token, uf]);

  useEffect(() => {
    if (hasCodEmpresaQuery && !intervalId) {
      loadHome();
    }

    return () => {
      clearInterval(intervalId);
      setIsLoading(false);
    };
  }, [hasCodEmpresaQuery, intervalId, loadHome]);

  return {
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
    workplacesOptions,
    hasError,
    setSelectedWorkplace,
    selectedWorkplace,
    setIsVerifyingCpf,
    hasCodEmpresaQuery,
    codEmpresa,
    calculateRoute,
    errorAtResultGeneration,
    consultExpired,
    consultCode,
    isSendingData,
    isManualFill,
    handleStreetnameChange,
    handleDistrictChange,
    mustSendAddressProof,
    addressProof,
    setAddressProof,
    isUfRj,
    isHighSalary,
    setIsHighSalary,
    mustVerifyIsRj,
    cellphone,
    handleCellphoneChange,
    sentEmail,
    sentWhatsapp,
    isMyLinkFull,
    linkToResult,
    setIsLoading,
    employeeCodeSt,
    fullWorkplaces: workplaces,
  };
}
