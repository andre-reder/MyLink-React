/* eslint-disable max-len */
import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import Button from '../../../../components/Button';
import FilterRadioButton from '../../../../components/FilterRadioButtons';
import { FilterRadioButtonsContainer } from '../../../../components/FilterRadioButtonsContainer';
import FormGroup from '../../../../components/FormGroup';
import Loader from '../../../../components/Loader';
import OpacityAnimation from '../../../../components/OpacityAnimation';
import { useAppContext } from '../../../../contexts/auth';
import homeService from '../../../../services/homeService';
import formatCurrency from '../../../../utils/formatCurrency';
import removeDuplicates from '../../../../utils/removeDuplicates';
import { ButtonsContainer, FormCard } from '../../styles';
import VtList from './components/VtList';

export default function ManualRouting({
  linkToResult,
  consultCode,
  employeeCode,
  companyCode,
  ufRes,
  ufLT,
  // setIsLoading,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState('going');

  const [selectedRegion, setSelectedRegion] = useState({ value: 0, label: 'Selecione a região do bilhete' });
  const [selectedOperator, setSelectedOperator] = useState({ value: 0, label: 'Selecione a operadora do bilhete' });
  const [selectedVt, setSelectedVt] = useState({ value: 0, label: 'Selecione o bilhete' });

  const [fullRegionsOptions, setFullRegionsOptions] = useState([{ value: 0, label: 'Selecione a região do bilhete' }]);
  const [fullOperatorOptions, setFullOperatorOptions] = useState([{ value: 0, label: 'Selecione a operadora do bilhete' }]);
  const [fullVtOptions, setFullVtOptions] = useState([{ value: 0, label: 'Selecione o bilhete' }]);

  const [selectedItens, setSelectedItens] = useState([]);

  const { token } = useAppContext();

  const navigate = useNavigate();

  const regionsOptions = useMemo(() => fullRegionsOptions?.map((x) => (
    { value: x?.codRegiao, label: x?.regiao }
  )), [fullRegionsOptions]);

  const operatorOptions = useMemo(() => {
    const filteredOperators = fullOperatorOptions?.filter((x) => x.codRegiao === selectedRegion.value);

    return filteredOperators?.map((x) => ({ value: x.codOperadora, label: x.nomeOp }));
  }, [fullOperatorOptions, selectedRegion.value]);

  const vtOptions = useMemo(() => {
    const filteredVts = fullVtOptions?.filter((x) => x?.codOperadora === selectedOperator?.value);

    return filteredVts?.map((x) => ({ value: x?.codITem, label: `${x?.descricao} - ${formatCurrency(x?.tarifa)}` }));
  }, [fullVtOptions, selectedOperator.value]);

  const getLists = useCallback(async () => {
    // console.log('getLists');
    setIsLoading(true);
    try {
      const lists = await homeService.getItensAndFiltersList({
        ufLT,
        ufRes,
        token,
      });

      if (lists.codigo === 0 && lists.codigoRet === 0) {
        toast.error('Erro ao buscar listas para inserção manual dos bilhetes usados.');
        return;
      }

      setFullRegionsOptions((prev) => removeDuplicates([...prev, ...(lists.listaRegioes || [])]));
      setFullOperatorOptions((prev) => removeDuplicates([...prev, ...(lists.listaOp || [])]));
      setFullVtOptions((prev) => removeDuplicates([...prev, ...(lists.listaVT || [])]));
    } catch (error) {
      toast.error(`Erro ao buscar listas para inserção manual dos bilhetes usados. (${error})`);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, ufLT, ufRes]);

  const directionToNumberMap = useMemo(() => ({
    going: 1,
    return: 2,
  }), []);

  const addVtToList = useCallback(() => {
    const vtToAdd = fullVtOptions.find((x) => x.codITem === selectedVt.value);

    setSelectedItens((prev) => {
      const currentDirectionLength = prev.filter((x) => x.sentido === directionToNumberMap[selectedDirection]).length;

      const vtToAddWithDirection = {
        sentido: directionToNumberMap[selectedDirection],
        sequencia: currentDirectionLength + 1,
        codITem: selectedVt.value,
        tarifa: vtToAdd.tarifa,
        codItemRot: vtToAdd.codItemRot,
      };

      return [...prev, vtToAddWithDirection];
    });

    toast.success('Bilhete adicionado com sucesso.');

    setSelectedVt({ value: 0, label: 'Selecione o bilhete' });
    // setSelectedOperator({ value: 0, label: 'Selecione a operadora do bilhete' });
    // setSelectedRegion({ value: 0, label: 'Selecione a região do bilhete' });
  }, [directionToNumberMap, fullVtOptions, selectedDirection, selectedVt.value]);

  const copyGoingToReturn = useCallback(() => {
    const goingItens = selectedItens.filter((x) => x.sentido === 1);
    goingItens.sort((a, b) => a.sequencia - b.sequencia);
    goingItens.reverse();

    setSelectedItens((prev) => [...prev, ...goingItens.map((x, i) => ({ ...x, sentido: 2, sequencia: i + 1 }))]);

    toast.success('Preenchemos os bilhetes automaticamente com base nos bilhetes informados na ida.');
  }, [selectedItens]);

  const confirmManualRouting = useCallback(async () => {
    setIsLoading(true);
    try {
      const confirmRouting = await homeService.confirmManualRouting({
        token,
        reqBody: JSON.stringify({
          appCode: 2,
          codConsulta: consultCode,
          codFuncionario: employeeCode,
          codEmpresa: companyCode,
          bilhetes: selectedItens,
        }),
      });

      if (confirmRouting.codigo === 0) {
        toast.error('Erro ao confirmar bilhetes inseridos manualmente.');
        return;
      }

      toast.success('Bilhetes inseridos manualmente confirmados com sucesso.');
      navigate(linkToResult);
    } catch (error) {
      toast.error(`Erro ao confirmar bilhetes inseridos manualmente. (${error})`);
    } finally {
      setIsLoading(false);
    }
  }, [companyCode, consultCode, employeeCode, linkToResult, navigate, selectedItens, setIsLoading, token]);

  const canConfirmManualRouting = useMemo(() => {
    const hasMoreThanOneGoing = selectedItens.filter((x) => x.sentido === 1).length > 0;
    const hasMoreThanOneReturn = selectedItens.filter((x) => x.sentido === 2).length > 0;

    return hasMoreThanOneGoing && hasMoreThanOneReturn;
  }, [selectedItens]);

  useEffect(() => {
    getLists();
  }, [getLists]);

  return (
    <>
      <Loader isLoading={isLoading} />
      <FormCard style={{ marginTop: '-8px' }}>
        <OpacityAnimation>
          <div className="title">
            Informe os bilhetes utilizados na sequência do seu deslocamento.
          </div>

          <FormGroup>
            <FilterRadioButtonsContainer>
              <FilterRadioButton onClick={() => setSelectedDirection('going')} selected={selectedDirection === 'going'}>
                Ida
              </FilterRadioButton>
              <FilterRadioButton onClick={() => setSelectedDirection('return')} selected={selectedDirection === 'return'} disabled={selectedItens.filter((x) => x.sentido === 1).length === 0}>
                Volta
              </FilterRadioButton>
            </FilterRadioButtonsContainer>
          </FormGroup>

          {selectedDirection === 'return' && selectedItens.filter((x) => x.sentido === 2).length === 0 && (
          <FilterRadioButtonsContainer style={{ marginTop: '16px' }}>
            <Button customHeight="48px" small onClick={() => copyGoingToReturn()}>
              Uso os mesmos bilhetes da ida
            </Button>
          </FilterRadioButtonsContainer>
          )}

          <FormGroup>
            <Select
              value={{ value: selectedRegion.value || 0, label: selectedRegion.label || 'Selecione a região do bilhete' }}
              options={removeDuplicates(regionsOptions)}
              placeholder="Região do Bilhete"
              onChange={(x) => {
                setSelectedRegion(x);
                setSelectedOperator({ value: 0, label: 'Selecione a operadora do bilhete' });
                setSelectedVt({ value: 0, label: 'Selecione o bilhete' });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Select
              value={{ value: selectedOperator.value || 0, label: selectedOperator.label || 'Selecione a operadora do bilhete' }}
              options={removeDuplicates(operatorOptions)}
              placeholder="Operadora do Bilhete"
              onChange={(x) => {
                setSelectedOperator(x);
                setSelectedVt({ value: 0, label: 'Selecione o bilhete' });
              }}
              isDisabled={!selectedRegion.value}
            />
          </FormGroup>

          <FormGroup>
            <Select
              value={{ value: selectedVt.value || 0, label: selectedVt.label || 'Selecione o bilhete' }}
              options={removeDuplicates(vtOptions)}
              placeholder="Bilhete"
              onChange={(x) => {
                setSelectedVt(x);
              }}
              isDisabled={!selectedOperator.value || !selectedRegion.value}
            />
          </FormGroup>

          <ButtonsContainer>
            <OpacityAnimation>
              <Button customHeight="48px" small onClick={() => setSelectedItens([])} disabled={selectedItens.length === 0}>
                Apagar Bilhetes (IDA E VOLTA)
              </Button>
            </OpacityAnimation>

            <OpacityAnimation>
              <Button customHeight="48px" small onClick={addVtToList} disabled={(!selectedVt.value)}>
                Adicionar Bilhete
                {' '}
                {selectedDirection === 'going' ? 'IDA' : 'VOLTA'}
              </Button>
            </OpacityAnimation>
          </ButtonsContainer>

          <VtList
            selectedItens={selectedItens}
            selectedDirection={directionToNumberMap[selectedDirection]}
            fullVtOptions={fullVtOptions}
            fullOperatorOptions={fullOperatorOptions}
          />

          <FilterRadioButtonsContainer style={{ marginTop: '32px' }}>
            <Button customHeight="48px" onClick={confirmManualRouting} disabled={!canConfirmManualRouting}>
              Confirmar Bilhetes
            </Button>
          </FilterRadioButtonsContainer>
        </OpacityAnimation>
      </FormCard>
    </>
  );
}

ManualRouting.propTypes = {
  linkToResult: PropTypes.string.isRequired,
  ufRes: PropTypes.string.isRequired,
  ufLT: PropTypes.string.isRequired,
  // setIsLoading: PropTypes.func.isRequired,
  consultCode: PropTypes.number.isRequired,
  employeeCode: PropTypes.number.isRequired,
  companyCode: PropTypes.number.isRequired,
};
