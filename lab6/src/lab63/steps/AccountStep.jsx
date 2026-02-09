import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const AccountStep = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Step 1: Account Setup
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        label="Username (ห้าม admin/root/superuser)"
        fullWidth
        margin="normal"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
    </Box>
  );
};

export default AccountStep;
