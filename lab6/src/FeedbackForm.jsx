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
import { useForm } from 'react-hook-form';
import axios from 'axios';

const FeedbackForm = () => {
  const [serverResponse, setServerResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', msg: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerResponse(null);

    try {
      const res = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
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
    <Paper elevation={4} sx={{ maxWidth: 500, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Customer Feedback
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full Name */}
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
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
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          defaultValue=""
          {...register('category', {
            required: 'กรุณาเลือกประเภท',
          })}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          <MenuItem value="">Select...</MenuItem>
          <MenuItem value="bug">Bug Report</MenuItem>
          <MenuItem value="suggestion">Suggestion</MenuItem>
          <MenuItem value="inquiry">General Inquiry</MenuItem>
        </TextField>

        {/* Message */}
        <TextField
          label="Message (min 20 chars)"
          multiline
          rows={4}
          fullWidth
          margin="normal"
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
          sx={{ mt: 2, py: 1.2 }}
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
        <Alert severity="success" sx={{ mt: 3 }}>
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
        <Alert severity={toast.type} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FeedbackForm;
