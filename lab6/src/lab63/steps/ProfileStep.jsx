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
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(180deg, rgba(0,150,136,0.08), rgba(0,150,136,0) 45%)',
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
        Profile
      </Typography>
      <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, mb: 1.5 }}>
        Step 2: Professional Profile
      </Typography>

      <TextField
        select
        label="Occupation"
        fullWidth
        margin="normal"
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
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
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
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
        size="medium"
        InputProps={{
          sx: { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' },
        }}
        {...register('githubUrl')}
        error={!!errors.githubUrl}
        helperText={errors.githubUrl?.message}
      />
    </Box>
  );
};

export default ProfileStep;
