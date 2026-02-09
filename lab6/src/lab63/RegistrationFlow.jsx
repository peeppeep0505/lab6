import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';

import { useLab63 } from './MultiStepFormContext';
import { defaultValues, stepSchemas } from './schemas';
import AccountStep from './steps/AccountStep';
import ProfileStep from './steps/ProfileStep';
import SummaryStep from './steps/SummaryStep';

const steps = ['Account Setup', 'Professional Profile', 'Summary'];

const RegistrationFlow = () => {
  const { step, setStep, formData, setFormData, clearAll } = useLab63();

  const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });
  const [serverResponse, setServerResponse] = useState(null);
  const [finalSubmitting, setFinalSubmitting] = useState(false);

  const schema = useMemo(
    () => stepSchemas[Math.max(0, step - 1)] ?? stepSchemas[0],
    [step],
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, ...formData },
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValidating, errors },
  } = methods;

  // Sync UI with Context (single source of truth) on load/step changes
  useEffect(() => {
    reset({ ...defaultValues, ...formData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const onNext = async (data) => {
    // merge step data into centralized context
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => Math.min(3, s + 1));
  };

  const onBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const onFinalSubmit = async () => {
    setFinalSubmitting(true);
    setServerResponse(null);

    try {
      // ส่งข้อมูลแบบ Flattened Object (รวมทุก step)
      const res = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        formData,
      );
      setServerResponse(res.data);
      setToast({ open: true, type: 'success', msg: 'สมัครสำเร็จ!' });

      // clear + reset
      clearAll();
      reset(defaultValues);
    } catch (e) {
      setToast({
        open: true,
        type: 'error',
        msg: 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่',
      });
    } finally {
      setFinalSubmitting(false);
    }
  };

  const disableNext = isSubmitting || isValidating || finalSubmitting;

  const lastJsonRef = useRef('');

  useEffect(() => {
    const sub = methods.watch((values) => {
      // กัน loop/เขียนซ้ำถี่ ๆ
      const json = JSON.stringify(values);
      if (json === lastJsonRef.current) return;
      lastJsonRef.current = json;

      // อัปเดต context ทุกครั้งที่พิมพ์ → Provider จะ persist ลง localStorage
      setFormData(values);
    });

    return () => sub.unsubscribe();
  }, [methods, setFormData]);

  // Navigation Guard (กันกด Next ตอนกำลัง validate แบบ async)
  // และ handleSubmit จะกันไม่ให้ผ่านถ้ามี errors อยู่แล้ว
  return (
    <Paper elevation={4} sx={{ maxWidth: 720, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        LAB 6.3 – Registration Flow
      </Typography>

      <Stepper activeStep={step - 1} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {isValidating && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Validating...
        </Alert>
      )}

      {/* แสดง error รวมแบบสั้น (optional) */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนไปขั้นถัดไป
        </Alert>
      )}

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
          {step === 1 && <AccountStep />}
          {step === 2 && <ProfileStep />}
          {step === 3 && (
            <SummaryStep data={formData} serverResponse={serverResponse} />
          )}

          <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
            <Button
              variant="outlined"
              disabled={step === 1 || disableNext}
              onClick={onBack}
            >
              Back
            </Button>

            {step < 3 ? (
              <Button type="submit" variant="contained" disabled={disableNext}>
                {disableNext ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Next Step'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={onFinalSubmit}
                disabled={disableNext}
              >
                {disableNext ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Confirm & Register'
                )}
              </Button>
            )}
          </Box>
        </Box>
      </FormProvider>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RegistrationFlow;
