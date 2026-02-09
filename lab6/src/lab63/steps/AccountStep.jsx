import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const AccountStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(180deg, rgba(25,118,210,0.08), rgba(25,118,210,0) 45%)',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
        Account
      </Typography>
      <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, mb: 1.5 }}>
        Step 1: Account Setup
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Username"
        fullWidth
        margin="normal"
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
    </Box>
  );
};

export default AccountStep;
