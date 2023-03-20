import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/auth';
import { useQuery } from '../../hooks/useQuery';
import resultService from '../../services/resultService';
import formatCurrency from '../../utils/formatCurrency';

export default function useResult() {
  const [isLoading, setIsLoading] = useState(true);
  const [goingRoute, setGoingRoute] = useState([]);
  const [returningRoute, setReturningRoute] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [view, setView] = useState('going');
  const [hasError, setHasError] = useState(false);
  const [exceededPrice, setExceededPrice] = useState(false);
  const [totalPrice, setTotalPrice] = useState('');
  const [resultStatus, setResultStatus] = useState('waiting');
  const [allowPdfDownload, setAllowPdfDownload] = useState(true);

  const [isSomeActionLoading, setIsSomeActionLoading] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentModalShow, setAdjustmentModalShow] = useState(false);
  const [refuseModalShow, setRefuseModalShow] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const { token } = useAppContext();
  const query = useQuery();
  const consultCode = query.get('codConsulta');
  const employeeCode = query.get('codFuncionario');
  const logo = query.get('logo');

  const getResult = useCallback(async () => {
    try {
      const result = await resultService.getResult({
        codConsulta: consultCode,
        codFuncionario: employeeCode,
        token,
      });
      if (!result.codigo) {
        toast.error(`Não foi possível carregar seu resultado. Por favor, tente novamente (${result.msg})`);
        setHasError(true);
        return;
      }
      setTotalPrice(formatCurrency(result.dadosConsulta.valorVtTotal));
      setGoingRoute(result.trajetoIda);
      setReturningRoute(result.trajetoVolta);
      setTickets(result.valeTransp);
      const maxPriceAllowed = result.valorTeto;
      const hasExceededPrice = (
        result.dadosConsulta.valorVtTotal > maxPriceAllowed
         && maxPriceAllowed !== 0);
      setExceededPrice(hasExceededPrice);
      if (hasExceededPrice) {
        toast.warn('Seu resultado está acima do valor máximo permitido pela sua empresa. Para mais detalhes entre em contato com o RH.', {
          icon: '💵',
          autoClose: false,
        });
      }
    } catch (error) {
      toast.error(`Não foi possível carregar seu resultado. Por favor, tente novamente (${error})`);
      setHasError(true);
    }
  }, [consultCode, employeeCode, token]);

  const checkResultStatus = useCallback(async () => {
    try {
      const bodyResultStatus = await resultService.checkResultStatus({
        codConsulta: consultCode,
        token,
      });
      if (!bodyResultStatus.codigo) {
        toast.error(`Não foi possível carregar seu resultado. Por favor, tente novamente (${bodyResultStatus.msg})`);
        setHasError(true);
        return;
      }
      const codStatusMap = {
        0: 'nothingDone',
        1: 'accepted',
        2: 'refused',
        3: 'waitingAnswer',
        4: 'answered',
      };
      const codStatusActionsMap = {
        0: () => toast.info('Resultado gerado! Por favor, selecione uma das opções para prosseguir'),
        1: () => toast.info('Seu resultado já foi aceito e implantado!'),
        2: () => toast.info('Você já optou pela não utilização do VT'),
        3: () => toast('Por favor, aguarde enquanto nossa equipe ajusta seu resultado conforme solicitado', {
          icon: '🕓',
        }),
        4: () => toast.success('Sua solicitação de ajuste foi respondida. Este é seu novo resultado!'),
      };
      codStatusActionsMap[bodyResultStatus.codStatus]();
      setResultStatus(codStatusMap[bodyResultStatus.codStatus]);
      setAllowPdfDownload(bodyResultStatus.ExibeCarta);
    } catch (error) {
      toast.error(`Não foi possível carregar seu resultado. Por favor, tente novamente (${error})`);
      setHasError(true);
    }
  }, [consultCode, token]);

  const loadResult = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        getResult(),
        checkResultStatus(),
      ]);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [checkResultStatus, getResult]);

  const requestAdjustment = useCallback(async () => {
    try {
      setAdjustmentModalShow(false);
      setIsSomeActionLoading(true);
      const adjustmentRequest = await resultService.makeAdjustmentRequest({
        token,
        comentario: encodeURIComponent(adjustmentReason),
        codConsulta: consultCode,
      });
      if (!adjustmentRequest.codigo) {
        toast.error(`Não foi possível enviar sua solicitação. Por favor, tente novamente (${adjustmentRequest.msg})`);
        setAdjustmentModalShow(true);
        return;
      }
      setResultStatus('waitingAnswer');
      toast.success('Sua solicitação foi enviada com sucesso. Por favor, aguarde até que nossa equipe ajuste seu resultado. Você receberá um aviso no seu e-mail quando o processo for concluído');
    } catch (error) {
      toast.error(`Não foi possível enviar sua solicitação. Por favor, tente novamente (${error})`);
      setAdjustmentModalShow(false);
    } finally {
      setIsSomeActionLoading(false);
    }
  }, [adjustmentReason, consultCode, token]);

  const handleResultAction = useCallback(async (action) => {
    try {
      setRefuseModalShow(false);
      setAcceptModalShow(false);
      setIsSomeActionLoading(true);
      const bodyAction = await resultService.handleResultAction({
        token,
        codConsulta: consultCode,
        cancelamento: action === 'refuse',
        exibeCarta: allowPdfDownload,
      });
      if (!bodyAction.codigo) {
        toast.error(`Não foi possível ${action === 'refuse' ? 'recusar o benefício' : 'implantar o resultado'}. Por favor, tente novamente (${bodyAction.msg})`);
        if (action === 'refuse') {
          setRefuseModalShow(true);
        } else {
          setAcceptModalShow(true);
        }
        return;
      }
      setResultStatus(action === 'refuse' ? 'refused' : 'accepted');
      toast.success(action === 'refuse' ? 'A opção pela não utilização do VT foi registrada com sucesso!' : 'Resultado aceito e implantado com sucesso!');
    } catch (error) {
      toast.error(`Não foi possível ${action === 'refuse' ? 'recusar o benefício' : 'implantar o resultado'}. Por favor, tente novamente (${error})`);
      if (action === 'refuse') {
        setRefuseModalShow(true);
      } else {
        setAcceptModalShow(true);
      }
    } finally {
      setIsSomeActionLoading(false);
    }
  }, [allowPdfDownload, consultCode, token]);

  function handleTryAgain() {
    loadResult();
  }

  function handleAdjustmentReasonChange(event) {
    setAdjustmentReason(event.target.value);
  }

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  return {
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
  };
}
