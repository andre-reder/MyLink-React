import PropTypes from 'prop-types';

import FormGroup from '../../../components/FormGroup';
import Input from '../../../components/Input';
import { AsideFormGroup } from '../styles';

export default function AddressCard({
  cep,
  handleCepChange,
  isGettinCepData,
  streetName,
  district,
  city,
  uf,
  number,
  complement,
  handleNumberChange,
  handleComplementChange,
  getErrorMessageByFieldName,
}) {
  return (
    <>
      <div className="title">
        Agora precisamos saber seu endereço.
      </div>
      <FormGroup isLoading={isGettinCepData} error={getErrorMessageByFieldName('cep')}>
        <Input
          placeholder="CEP"
          value={cep}
          onChange={handleCepChange}
          maxLength="9"
          disabled={isGettinCepData}
          error={getErrorMessageByFieldName('cep')}
        />
      </FormGroup>
      <FormGroup isLoading={isGettinCepData}>
        <Input
          disabled
          placeholder="Logradouro"
          value={streetName}
        />
      </FormGroup>
      <AsideFormGroup>
        <FormGroup error={getErrorMessageByFieldName('number')} aside>
          <Input
            placeholder="Número"
            value={number}
            onChange={handleNumberChange}
            error={getErrorMessageByFieldName('number')}
          />
        </FormGroup>
        <FormGroup error={getErrorMessageByFieldName('complement')} aside>
          <Input
            placeholder="Complemento"
            value={complement}
            onChange={handleComplementChange}
            error={getErrorMessageByFieldName('complement')}
          />
        </FormGroup>
      </AsideFormGroup>
      <FormGroup isLoading={isGettinCepData}>
        <Input
          disabled
          placeholder="Bairro"
          value={district}
        />
      </FormGroup>
      <FormGroup isLoading={isGettinCepData}>
        <Input
          disabled
          placeholder="Cidade"
          value={city}
        />
      </FormGroup>
      <FormGroup isLoading={isGettinCepData}>
        <Input
          disabled
          placeholder="UF"
          value={uf}
        />
      </FormGroup>
    </>
  );
}

AddressCard.propTypes = {
  isGettinCepData: PropTypes.bool.isRequired,
  getErrorMessageByFieldName: PropTypes.func.isRequired,
  cep: PropTypes.string.isRequired,
  handleCepChange: PropTypes.func.isRequired,
  streetName: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  complement: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  district: PropTypes.string.isRequired,
  uf: PropTypes.string.isRequired,
  handleNumberChange: PropTypes.func.isRequired,
  handleComplementChange: PropTypes.func.isRequired,
};