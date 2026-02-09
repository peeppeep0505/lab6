import React, { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import DynamicField from './DynamicField';
import { buildDefaultValues, generateZodSchema } from './formEngineUtils';

const FormEngine = ({ schema }) => {
  const [payload, setPayload] = useState(null);

  // ✅ C2: log dynamic schema ที่ถูก rebuild ตาม JSON
  const zodSchema = useMemo(() => {
    const dynamicSchema = generateZodSchema(schema.fields || []);
    console.log('Dynamic Zod Schema rebuilt:', dynamicSchema);
    return dynamicSchema;
  }, [schema]);

  const defaultValues = useMemo(
    () => buildDefaultValues(schema.fields || []),
    [schema],
  );

  const methods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: 'onChange',
  });

  // ✅ C4: Final Payload log (ตอน submit ผ่านเท่านั้น)
  const onSubmit = (data) => {
    console.log('Final Payload:', data);
    setPayload(data);
  };

  // ✅ ถ้า submit ไม่ผ่าน validation ให้เห็น error ใน console ทันที
  const onError = (errs) => {
    console.log('Submit blocked by errors:', errs);
  };

  const hasErrors = Object.keys(methods.formState.errors || {}).length > 0;

  return (
    <Paper elevation={4} sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        LAB 6.5 – Dynamic Form Engine
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {schema.formTitle}
      </Typography>

      {hasErrors && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          กรุณากรอกข้อมูลให้ครบและถูกต้องก่อน Submit
        </Alert>
      )}

      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={methods.handleSubmit(onSubmit, onError)}
          noValidate
        >
          {(schema.fields || []).map((f) => (
            <DynamicField key={f.name} field={f} parentPath="" />
          ))}

          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Submit
          </Button>
        </Box>
      </FormProvider>

      {payload && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography fontWeight="bold" mb={1}>
            Payload JSON
          </Typography>
          <pre style={{ margin: 0, fontSize: 12 }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </Alert>
      )}
    </Paper>
  );
};

export default FormEngine;
