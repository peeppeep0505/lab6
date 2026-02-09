import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const FeedbackForm = () => {
  const [serverResponse, setServerResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerResponse(null);

    try {
      const res = await axios.post(
        'https://jsonplaceholder.typicode.co/posts',
        data,
      );

      setServerResponse(res.data);
      setToast({
        open: true,
        type: 'success',
        msg: 'ส่งข้อมูลสำเร็จ!',
      });
      reset();
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        msg: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
      });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 560,
        mx: 'auto',
        mt: 6,
        p: 4,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(180deg, rgba(25,118,210,0.08), rgba(25,118,210,0) 40%)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
        Customer Care
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
        Tell us about your experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Your feedback helps us improve our service quality.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full Name */}
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          size="medium"
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
          }}
          {...register('fullName', {
            required: 'กรุณากรอกชื่อ-นามสกุล',
            pattern: {
              value: /^[a-zA-Z\sก-ฮะ-์]+$/,
              message: 'ชื่อห้ามมีตัวเลขหรืออักขระพิเศษ',
            },
          })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          size="medium"
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
          }}
          {...register('email', {
            required: 'กรุณากรอกอีเมล',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'รูปแบบอีเมลไม่ถูกต้อง',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          defaultValue=""
          rules={{ required: 'กรุณาเลือกประเภท' }}
          render={({ field }) => (
            <TextField
              select
              label="Category"
              fullWidth
              margin="normal"
              size="medium"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
              }}
              {...field}
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              <MenuItem value="">Select...</MenuItem>
              <MenuItem value="bug">Bug Report</MenuItem>
              <MenuItem value="suggestion">Suggestion</MenuItem>
              <MenuItem value="inquiry">General Inquiry</MenuItem>
            </TextField>
          )}
        />


        {/* Message */}
        <TextField
          label="Message (min 20 chars)"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          size="medium"
          variant="outlined"
          InputProps={{
            sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
          }}
          {...register('message', {
            required: 'กรุณากรอกข้อความ',
            minLength: {
              value: 20,
              message: 'ข้อความต้องอย่างน้อย 20 ตัวอักษร',
            },
            maxLength: {
              value: 500,
              message: 'ข้อความต้องไม่เกิน 500 ตัวอักษร',
            },
          })}
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 2.5,
            py: 1.3,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: 0.3,
            boxShadow: '0 10px 20px rgba(25,118,210,0.25)',
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </Box>

      {/* Server Response */}
      {serverResponse && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2">Server Response</Typography>
          <pre style={{ fontSize: 12 }}>
            {JSON.stringify(serverResponse, null, 2)}
          </pre>
        </Alert>
      )}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} variant="filled" sx={{ borderRadius: 2 }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FeedbackForm;
