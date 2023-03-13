import { useState } from 'react';
import { Container } from './styles';

import Header from './components/Header';
import ProgressSteps from './components/ProgressSteps';

export default function Home() {
  const [activeStep, setActiveStep] = useState(1);
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

  return (
    <Container>
      <Header />

      <ProgressSteps steps={steps} activeStep={activeStep} />

      {/* <PersonalInfoCard />

      <AddressCard />

      <CompanySelectionCard /> */}
    </Container>
  );
}
