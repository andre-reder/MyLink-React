import PropTypes from 'prop-types';

import FormGroup from '../../../components/FormGroup';
import Input from '../../../components/Input';

export default function PersonalInfoCard({
  isVerifyingCpf,
  getErrorMessageByFieldName,
  cpf,
  handleCpfChange,
  name,
  handleNameChange,
  email,
  handleEmailChange,
  cellphone,
  handleCellphoneChange,
}) {
  return (
    <>
      <div className="title">
        Para começar, informe seus dados pessoais.
      </div>
      <FormGroup isLoading={isVerifyingCpf} error={getErrorMessageByFieldName('cpf')}>
        <Input
          placeholder="CPF"
          value={cpf}
          onChange={handleCpfChange}
          maxLength="14"
          disabled={isVerifyingCpf}
          error={getErrorMessageByFieldName('cpf')}
        />
      </FormGroup>
      <FormGroup error={getErrorMessageByFieldName('name')}>
        <Input
          placeholder="Nome completo"
          value={name}
          onChange={handleNameChange}
          error={getErrorMessageByFieldName('name')}
        />
      </FormGroup>
      <FormGroup error={getErrorMessageByFieldName('email')}>
        <Input
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
          error={getErrorMessageByFieldName('email')}
        />
      </FormGroup>
      <FormGroup error={getErrorMessageByFieldName('cellphone')}>
        <Input
          placeholder="Celular (WhatsApp)"
          value={cellphone}
          onChange={handleCellphoneChange}
          error={getErrorMessageByFieldName('cellphone')}
        />
      </FormGroup>
    </>
  );
}

PersonalInfoCard.propTypes = {
  isVerifyingCpf: PropTypes.bool.isRequired,
  getErrorMessageByFieldName: PropTypes.func.isRequired,
  cpf: PropTypes.string.isRequired,
  handleCpfChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
  cellphone: PropTypes.string.isRequired,
  handleCellphoneChange: PropTypes.func.isRequired,
};
