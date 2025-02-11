/* eslint-disable max-len */
import {
  useCallback, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from '../../contexts/auth';
import { useQuery } from '../../hooks/useQuery';
import resultService from '../../services/resultService';
import formatCurrency from '../../utils/formatCurrency';
import renderArrayWithComa from '../../utils/renderArrayWithComa';
// import sendLinkWhatsapp from '../../utils/sendLinkWhatsapp';
import sendDocumentWhatsapp from '../../utils/sendDocumentWhatsapp';

export default function useResult() {
  const [isLoading, setIsLoading] = useState(true);
  const [goingRoute, setGoingRoute] = useState([]);
  const [returningRoute, setReturningRoute] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [employeeCellphone, setEmployeeCellphone] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [view, setView] = useState('going');
  const [hasError, setHasError] = useState(false);
  const [exceededPrice, setExceededPrice] = useState(false);
  const [totalPrice, setTotalPrice] = useState('');
  const [resultStatus, setResultStatus] = useState('waiting');
  const [allowPdfDownload, setAllowPdfDownload] = useState(true);
  const [isTicketsTabVisible, setIsTicketsTabVisible] = useState(true);

  const [isSomeActionLoading, setIsSomeActionLoading] = useState(false);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentModalShow, setAdjustmentModalShow] = useState(false);
  const [refuseModalShow, setRefuseModalShow] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const [remainingAdjustmentChars, setRemainingAdjustmentChars] = useState(300);

  const [isRefuseButtonDisabled, setIsRefuseButtonDisabled] = useState(true);
  const [isAcceptButtonDisabled, setIsAcceptButtonDisabled] = useState(true);

  const [isBkConsultAndNotOptimized, setIsBkConsultAndNotOptimized] = useState(false);
  const [canShowMap, setCanShowMap] = useState(false);

  const { token } = useAppContext();
  const query = useQuery();
  const consultCode = query.get('codConsulta');
  const employeeCode = query.get('codFuncionario');
  const logo = query.get('logo');

  const checkIfCanShowMap = useCallback(async () => {
    const checkMap = await fetch(`https://utils.captamobilidade.com.br/routing-maps/${consultCode}_1_1_1`);
    // const checkMap = await fetch(`http://localhost:3001/routing-maps/${consultCode}_1_1_1`);

    const canShow = await checkMap.json();

    if (canShow.success) {
      setCanShowMap(true);
      return;
    }

    setCanShowMap(false);
  }, [consultCode]);

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
      if (result.dadosFuncionario.codEmpresa === 24175 && result.dadosConsulta.statusRot === 69) {
        setIsBkConsultAndNotOptimized(true);
        return;
      }
      if (result.dadosConsulta.statusRot === 69) {
        setIsTicketsTabVisible(false);
      }
      setTotalPrice(formatCurrency(result.dadosConsulta.valorVtTotal));
      setGoingRoute(result.trajetoIda);
      setReturningRoute(result.trajetoVolta);
      setTickets(result.valeTransp);
      setEmployeeCellphone(result.dadosFuncionario.celularFunc);
      setEmployeeName(result.dadosFuncionario.nome);
      setCompanyName(result.nomeEmp);
      setAllowPdfDownload(result.ExibeCarta);
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
        0: () => toast.info('Resultado gerado! Por favor, selecione uma das opções para prosseguir', {
          toastId: 'resultDone',
        }),
        1: () => toast.info('Seu resultado já foi aceito e implantado!', {
          toastId: 'resultImplanted',
        }),
        2: () => toast.info('Você já optou pela não utilização do VT', {
          toastId: 'resultImplanted',
        }),
        3: () => toast('Por favor, aguarde enquanto nossa equipe ajusta seu resultado conforme solicitado', {
          icon: '🕓',
          toastId: 'resultWaiting',
        }),
        4: () => toast.success('Sua solicitação de ajuste foi respondida. Este é seu novo resultado!', {
          toastId: 'adjustmentAnswered',
        }),
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
      setHasError(false);
      await Promise.all([
        getResult(),
        checkResultStatus(),
        checkIfCanShowMap(),
      ]);
    } catch (error) {
      toast.error(`Não foi possível carregar a página. Por favor, tente novamente (${error})`);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [checkResultStatus, getResult, checkIfCanShowMap]);

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

  const handleResultAction = useCallback(async (action, canvas) => {
    try {
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

      if (allowPdfDownload) {
        const docLink = bodyAction.linkCarta;
        const logoSrc = bodyAction.linkLogo;

        // const sentWhatsapp = await sendLinkWhatsapp({
        //   phone: employeeCellphone,
        //   message: `😄 Seu processo de roteirização de vale-transporte foi concluído com sucesso! Você pode visualizar e baixar a sua carta de opção de Vale-Transporte através do link abaixo:\n\nCaso não consiga clicar no link, responda a essa mensagem, ou nos adicione em sua lista de contatos.\n\n${docLink}`,
        //   image: logoSrc,
        //   linkUrl: docLink,
        //   title: 'Carta de Vale-Transporte',
        //   linkDescription: 'Clique aqui para acessar sua carta de opção de Vale-Transporte!',
        // });

        const sentWhatsapp = await sendDocumentWhatsapp({
          phone: employeeCellphone,
          message: `👋 Olá, ${employeeName}! \n\n😄 Boa notícia! \n\nSeu processo de roteirização de vale-transporte foi concluído com sucesso! Aqui está a sua carta de opção de Vale-Transporte.`,
          linkUrl: docLink,
          fileName: `Carta de Opção de VT - ${employeeName}`,
          companyName,
          contactName: employeeName,
        });

        const channelsThatMessageWasSent = [bodyAction.enviouEmail ? 'e-mail' : '', sentWhatsapp.success ? 'WhatsApp' : ''].filter((x) => !!x);

        toast.info(`Não se esqueça de fazer o download de sua carta, clicando no botão "Baixar Carta", e enviá-la para o RH de sua empresa! Também enviamos o link para acessar a carta em seu ${renderArrayWithComa(channelsThatMessageWasSent)}`, { style: { fontWeight: 'bold' } });
      }

      const dataUrl = canvas.toDataURL('image/png');
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], 'image.png', { type: 'image/png' });

      const bodySendSignature = await resultService.sendSignature({
        codFuncionario: employeeCode,
        reqBody: [{ key: 'file', value: file }],
      });
      if (!bodySendSignature.codigo) {
        toast.error(`Não foi possível registrar a assinatura, mas não se preocupe! O seu resultado foi implantado normalmente. (${bodySendSignature.msg})`);
      }
      toast.success(action === 'refuse' ? 'A opção pela não utilização do VT foi registrada com sucesso!' : 'Resultado aceito e implantado com sucesso!');
      setAcceptModalShow(false);
      setRefuseModalShow(false);
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
  }, [allowPdfDownload, companyName, consultCode, employeeCellphone, employeeCode, employeeName, token]);

  function handleTryAgain() {
    loadResult();
  }

  function handleAdjustmentReasonChange(event) {
    setAdjustmentReason(event.target.value);
    setRemainingAdjustmentChars(300 - event.target.value.length);
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
    remainingAdjustmentChars,
    isRefuseButtonDisabled,
    setIsRefuseButtonDisabled,
    isAcceptButtonDisabled,
    setIsAcceptButtonDisabled,
    isBkConsultAndNotOptimized,
    canShowMap,
    isTicketsTabVisible,
  };
}
