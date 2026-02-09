import React from 'react';
import { CssBaseline } from '@mui/material';
import FormEngine from './FormEngine';
import { sampleSchema } from './sampleSchema';

const Lab65App = () => (
  <>
    <CssBaseline />
    <FormEngine schema={sampleSchema} />
  </>
);

export default Lab65App;
