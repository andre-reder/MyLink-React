import { useRef } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import FormGroup from '../../../components/FormGroup';
import Input from '../../../components/Input';
import { AsideFormGroup } from '../styles';
import { SecondaryButton } from '../../../components/SecondaryButton';

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
  isManualFill,
  handleStreetnameChange,
  handleDistrictChange,
  getErrorMessageByFieldName,
  mustSendAddressProof,
  addressProof,
  setAddressProof,
}) {
  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

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
      <FormGroup isLoading={isGettinCepData} error={getErrorMessageByFieldName('streetname')}>
        <Input
          disabled={!isManualFill}
          error={getErrorMessageByFieldName('streetname')}
          onChange={handleStreetnameChange}
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
      <FormGroup isLoading={isGettinCepData} error={getErrorMessageByFieldName('district')}>
        <Input
          disabled={!isManualFill}
          placeholder="Bairro"
          error={getErrorMessageByFieldName('district')}
          onChange={handleDistrictChange}
          value={district}
        />
      </FormGroup>
      {mustSendAddressProof ? (
        <AsideFormGroup>
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
        </AsideFormGroup>
      ) : (
        <>
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
      )}

      {mustSendAddressProof && (
        <FormGroup>
          <SecondaryButton onClick={handleClick}>
            {addressProof ? `Alterar comprovante (${addressProof?.name})` : 'Escolher comprovante'}
          </SecondaryButton>

          <input
            type="file"
            accept=".jpg, .pdf"
            onChange={(event) => {
              setAddressProof(event.target.files[0]);
              toast.success(`Comprovante enviado com sucesso. Arquivo escolhido: ${event.target.files[0].name}`);
            }}
            style={{ display: 'none' }}
            ref={hiddenFileInput}
          />

        </FormGroup>
      )}
    </>
  );
}

AddressCard.propTypes = {
  mustSendAddressProof: PropTypes.bool.isRequired,
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
  isManualFill: PropTypes.bool.isRequired,
  handleStreetnameChange: PropTypes.func.isRequired,
  handleDistrictChange: PropTypes.func.isRequired,
  addressProof: PropTypes.string.isRequired,
  setAddressProof: PropTypes.func.isRequired,
};
