import React from 'react';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const ProfileStep = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const occupation = watch('occupation');

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Step 2: Professional Profile
      </Typography>

      <TextField
        select
        label="Occupation"
        fullWidth
        margin="normal"
        defaultValue=""
        {...register('occupation')}
        error={!!errors.occupation}
        helperText={errors.occupation?.message}
      >
        <MenuItem value="">Select...</MenuItem>
        <MenuItem value="Developer">Developer</MenuItem>
        <MenuItem value="Designer">Designer</MenuItem>
        <MenuItem value="Manager">Manager</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      <TextField
        label="Company"
        fullWidth
        margin="normal"
        {...register('company')}
        error={!!errors.company}
        helperText={errors.company?.message}
      />

      <TextField
        label={
          occupation === 'Developer'
            ? 'GitHub URL (required)'
            : 'GitHub/Portfolio URL (optional)'
        }
        fullWidth
        margin="normal"
        {...register('githubUrl')}
        error={!!errors.githubUrl}
        helperText={errors.githubUrl?.message}
      />
    </Box>
  );
};

export default ProfileStep;
