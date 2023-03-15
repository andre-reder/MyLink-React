/* eslint-disable max-len */
import { useCallback, useEffect, useState } from 'react';
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

export default function useHome() {
  const [isLoading, setIsLoading] = useState(false);
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

  const [consultCode, setConsultCode] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

  const [workplaces, setWorkplaces] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState({});

  const [isVerifyingCpf, setIsVerifyingCpf] = useState(false);
  const [isGettinCepData, setIsGettingCepData] = useState(false);

  const [intervalId, setIntervalId] = useState(null);

  const [companyNotAllowed, setCompanyNotAllowed] = useState(true);
  const [errorAtResultGeneration, setErrorAtResultGeneration] = useState(false);
  const [consultExpired, setConsultExpired] = useState(false);

  const {
    setError, removeError, getErrorMessageByFieldName, errors,
  } = useErrors();

  const navigate = useNavigate();

  const query = useQuery();
  const codEmpresa = query.get('codEmpresa');
  const hasCodEmpresaQuery = query.has('codEmpresa');

  const isFirstStepValid = (cpf && name && email && !errors.some((err) => (
    err.field === 'name' || err.field === 'cpf' || err.field === 'email'
  )));
  const isSecondStepValid = (cep && streetName && number && district && city && uf && !errors.some((err) => (
    err.field === 'cep'
  )));
  const isThirdStepValid = (selectedWorkplace.value && errors.length === 0);
  const stepsValidationMap = {
    1: isFirstStepValid,
    2: isSecondStepValid,
    3: isThirdStepValid,
  };
  const canAdvanceStep = stepsValidationMap[activeStep];

  const steps = [
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
  ];

  function handleNameChange(event) {
    setName(event.target.value);
    if (!event.target.value) {
      setError({ field: 'name', message: 'Nome é obrigatório!' });
    } else {
      removeError('name');
    }
  }

  function handleCpfChange(event) {
    setCpf(formatCpf(event.target.value));
    if (!event.target.value || !isCpfvalid(formatCpf(event.target.value))) {
      setError({ field: 'cpf', message: 'Informe um cpf válido!' });
    } else {
      removeError('cpf');
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

  const nextStep = () => {
    setActiveStep((prevState) => prevState + 1);
  };

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
    } catch (error) {
      toast.error(`Ocorreu um erro ao buscar o CEP (${error})`);
      setIsGettingCepData(false);
    }
  }, [removeError, setError]);

  const checkIsCompanyHabilitated = useCallback(async () => {
    try {
      const isCompanyHabilitated = await homeService.checkIsCompanyHabilitated({
        codEmpresa,
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
      });
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    }
  }, [codEmpresa]);

  const getWorkplaces = useCallback(async () => {
    try {
      const workplacesList = await homeService.getWorkplacesList({
        codEmpresa,
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
  }, [codEmpresa]);

  const loadHome = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        checkIsCompanyHabilitated(),
        getWorkplaces(),
      ]);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [checkIsCompanyHabilitated, getWorkplaces]);

  const checkResultStatus = useCallback(async () => {
    try {
      const status = await homeService.checkResulStatus({
        codConsulta: consultCode,
      });
      if (!status.codigo) {
        toast.info(`Não conseguimos recuperar o status de processamento da sua consulta (${status.msg})`);
      }
      const statusMapActions = {
        0: () => toast.info('Sua consulta foi gerada e está aguardando seu processamento ser iniciado'),
        1: () => toast.info('Sua consulta está sendo processada. Em alguns segundos o resultado será gerado!'),
        2: () => navigate(`/resultado?codFuncionario=${employeeCode}&codConsulta=${consultCode}&logo=${logoSrc || false}`),
        3: () => setErrorAtResultGeneration(true),
        4: () => setConsultExpired(true),
      };
      statusMapActions[status.statusProcessamento.codSta]();
    } catch (error) {
      toast.error(`Não conseguimos checar o status de processamento do seu resultado (${error})`);
    }
  }, [consultCode, employeeCode, logoSrc, navigate]);

  const startResultStatusInterval = useCallback(() => {
    const id = setInterval(() => {
      checkResultStatus();
    }, 4000);
    setIntervalId(id);
  }, [checkResultStatus]);

  const calculateRoute = useCallback(async () => {
    try {
      const bodySentToCalculate = toast.promise(await homeService.calculateRoute({
        codEmpresa,
        codLocTrab: selectedWorkplace.value,
        reqBody: JSON.stringify({
          cpf,
          nome: name,
          email,
          cepF: cep,
          logradouroF: streetName,
          numF: number,
          complementoF: complement,
          bairroF: district,
          cidadeF: city,
          ufF: uf,
        }),
      }), {
        pending: 'Estamos enviando seus dados para roteirização',
        success: 'Estamos gerando seu resultado!',
      });
      const hasBeenSentSuccessfully = bodySentToCalculate.codigo;
      if (!hasBeenSentSuccessfully) {
        toast.error(`Houve um erro ao enviar seus dados para roteirização. Por favor, tente novamente ${bodySentToCalculate.msg}`);
        prevStep();
        return;
      }
      nextStep();
      setConsultCode(bodySentToCalculate.codConsulta);
      setEmployeeCode(bodySentToCalculate.codFuncionario);
      startResultStatusInterval();
    } catch (error) {
      toast.error(`Houve um erro ao enviar seus dados para roteirização. Por favor, tente novamente ${error}`);
      prevStep();
    }
  }, [cep, city, codEmpresa, complement, cpf, district, email, name, number, selectedWorkplace.value, startResultStatusInterval, streetName, uf]);

  useEffect(() => {
    if (hasCodEmpresaQuery) {
      loadHome();
    }

    return () => {
      clearInterval(intervalId);
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
    calculateRoute,
    errorAtResultGeneration,
    consultExpired,
    consultCode,
  };
}
