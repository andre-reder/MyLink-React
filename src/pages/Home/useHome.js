/* eslint-disable max-len */
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useErrors from '../../hooks/useErrors';
import { useQuery } from '../../hooks/useQuery';
import formatCpf from '../../utils/formatCpf';
import isCpfvalid from '../../utils/isCpfValid';
import isEmailValid from '../../utils/isEmailValid';
import formatCep from '../../utils/formatCep';
import onlyNumbers from '../../utils/onlyNumbers';
import homeService from '../../services/homeService';
import { useAppContext } from '../../contexts/auth';

export default function useHome() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingData, setIsSendingData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [logoSrc, setLogoSrc] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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
  const [, setEmployeeCode] = useState('');

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

  const isFirstStepValid = (cpf && name && email && !errors.some((err) => (
    err.field === 'name' || err.field === 'cpf' || err.field === 'email'
  )));
  const isSecondStepValid = (cep && streetName && number && district && city && uf && !errors.some((err) => (
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
        toast.warn('Identificamos que sua residência fica no estado do RJ, portanto, precisamos saber se seu salário é maior que R$ 3.221,00 para atribuir corretamente os valores de sua consulta por conta da regra de integração que funciona de forma diferente dependendo deste critério', { toastId: 'isUfRj' });
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
      setCompanyNotAllowed(false);
      toast.success('Olá! Seja bem-vindo ao My-Link. Aqui você realizará sua roteirização de Vale Transporte.', {
        icon: '👋',
        toastId: 'welcomeToast',
      });
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
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
      }));
      setWorkplaces(workplacesListMapped);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    }
  }, [codEmpresa, token]);

  const checkResultStatus = useCallback(async (consult, employee) => {
    try {
      const status = await homeService.checkResulStatus({
        codConsulta: consult,
        token,
      });
      if (!status.codigo) {
        toast.info(`Não conseguimos recuperar o status de processamento da sua consulta (${status.msg})`);
      }
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
          setErrorAtResultGeneration(true);
          clearInterval(intervalId);
          toast.dismiss(toastStatusId.current);
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
  }, [intervalId, logoSrc, navigate, token]);

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
      const bodySentToCalculate = await toast.promise(homeService.calculateRoute({
        codEmpresa,
        codLocTrab: selectedWorkplace.value,
        semIntregraRJ: isUfRj && mustVerifyIsRj,
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
        }),
      }), {
        pending: 'Estamos enviando seus dados para a roteirização.',
        success: 'Seus dados foram enviados com sucesso!',
        error: 'Não foi possível enviar seus dados para a roteirização',
      });
      const hasBeenSentSuccessfully = bodySentToCalculate.codigo;
      if (!hasBeenSentSuccessfully) {
        toast.error(`Houve um erro ao enviar seus dados para roteirização. Por favor, tente novamente ${bodySentToCalculate.msg}`);
        prevStep();
        return;
      }
      toastStatusId.current = toast('Só mais um pouco! Vamos atualizar aqui pra você o status do processamento do seu resultdao.', {
        autoClose: false,
        icon: '😁',
      });
      const employeeCode = bodySentToCalculate.codFuncionario;
      if (mustSendAddressProof) {
        const bodySendSignature = await homeService.sendAddressProof({
          codFuncionario: employeeCode,
          reqBody: [{ key: 'file', value: addressProof }],
        });
        if (!bodySendSignature.codigo) {
          toast.warn(`Não foi possível enviar seu comprovante, mas não se preocupe! O seu resultado continua sendo gerado normalmente. (${bodySendSignature.msg})`);
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
  }, [addressProof, cep, city, codEmpresa, complement, cpf, district, email, isUfRj, mustSendAddressProof, mustVerifyIsRj, name, nextStep, number, selectedWorkplace.value, startResultStatusInterval, streetName, token, uf]);

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
  };
}
