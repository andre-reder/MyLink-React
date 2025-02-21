import PropTypes from 'prop-types';
import { useMemo } from 'react';
import formatCurrency from '../../../../../../utils/formatCurrency';
import { VTListContainer } from './styles';

export default function VtList({
  selectedItens,
  selectedDirection,
  fullVtOptions,
  fullOperatorOptions,
}) {
  const itensByDirection = useMemo(() => (
    selectedItens.filter((x) => x.sentido === selectedDirection)
  ), [selectedItens, selectedDirection]);

  itensByDirection.sort((a, b) => a.sequencia - b.sequencia);

  const findCorrespondingVt = (codItem) => fullVtOptions.find((x) => x.codITem === codItem);
  const findCorrespondingOperator = (codItem) => {
    const correspondingVt = findCorrespondingVt(codItem);
    const operatorOfVt = fullOperatorOptions.find((x) => (
      x.codOperadora === correspondingVt.codOperadora
    ));

    return operatorOfVt;
  };

  return (
    <VTListContainer>
      <h4>
        Lista de bilhetes (
        {selectedDirection === 1 ? 'Ida' : 'Volta'}
        ):
      </h4>

      {itensByDirection.length === 0 && (
        <div>
          <div className="infoContainer">
            <small>
              Nenhum bilhete adicionado
            </small>
          </div>
        </div>
      )}

      {itensByDirection.length > 0 && (
        <div>
          {itensByDirection.map((x) => (
            <div className="infoContainer" key={`${x.sentido}${x.sequencia}${x.codITem}`}>
              <small className="manual">
                <img src={findCorrespondingOperator(x.codITem).opUrlLogo} alt="" className="manual" />

                <span>
                  <strong>
                    {x.sequencia}
                    {'°) '}
                  </strong>
                  {findCorrespondingVt(x.codITem).descricao}
                  {' '}
                  -
                  {' '}
                  <strong>
                    {formatCurrency(findCorrespondingVt(x.codITem).tarifa)}
                  </strong>
                </span>
              </small>
            </div>
          ))}
        </div>
      )}
    </VTListContainer>
  );
}

VtList.propTypes = {
  selectedItens: PropTypes.arrayOf(PropTypes.objectOf()).isRequired,
  fullVtOptions: PropTypes.arrayOf(PropTypes.objectOf()).isRequired,
  fullOperatorOptions: PropTypes.arrayOf(PropTypes.objectOf()).isRequired,
  selectedDirection: PropTypes.string.isRequired,
};
