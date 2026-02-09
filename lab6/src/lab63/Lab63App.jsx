import React from 'react';
import { CssBaseline } from '@mui/material';
import { MultiStepFormProvider } from './MultiStepFormContext';
import RegistrationFlow from './RegistrationFlow';

const Lab63App = () => {
  return (
    <MultiStepFormProvider>
      <CssBaseline />
      <RegistrationFlow />
    </MultiStepFormProvider>
  );
};

export default Lab63App;
